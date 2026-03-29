from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source='supplier.username', read_only=True)

    class Meta:
        model = Product
        fields = '__all__'

    def get_stock_status(self, obj):
        return obj.get_stock_status()