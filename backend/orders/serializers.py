from rest_framework import serializers
from django.db import transaction
from django.db.models import F
from .models import Order, OrderItem
from products.models import Product
from inventory.models import Inventory


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['product', 'quantity']


class OrderSerializer(serializers.ModelSerializer):

    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'created_at', 'total_amount', 'items']
        read_only_fields = ['total_amount']

    @transaction.atomic
    def create(self, validated_data):

        items_data = validated_data.pop('items')
        order = Order.objects.create()

        total = 0

        for item_data in items_data:

            product = Product.objects.select_for_update().get(
                id=item_data['product'].id
            )

            quantity = item_data['quantity']

            # Stock check
            if product.stock < quantity:
                raise serializers.ValidationError(
                    f"Not enough stock for {product.name}"
                )

            # Safe stock update
            Product.objects.filter(id=product.id).update(
                stock=F('stock') - quantity
            )

            product.refresh_from_db()

            # Inventory OUT transaction
            Inventory.objects.create(
                product=product,
                quantity=quantity,
                transaction_type='OUT',
                reference=f"Order #{order.id}"
            )

            price = product.price
            total += price * quantity

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=price
            )

        order.total_amount = total
        order.save()

        return order
    

from rest_framework import serializers


class TopProductSerializer(serializers.Serializer):
    product_name = serializers.CharField()
    total_sold = serializers.IntegerField()


class MonthlySalesSerializer(serializers.Serializer):
    month = serializers.CharField()
    total_sales = serializers.IntegerField()


class StockDistributionSerializer(serializers.Serializer):
    name = serializers.CharField(source='category__name', allow_null=True)
    stock = serializers.IntegerField()