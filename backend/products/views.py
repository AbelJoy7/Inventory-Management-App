from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import F
from django.shortcuts import get_object_or_404

from .models import Product
from .serializers import ProductSerializer

from ai.demand_forecast import predict_product_demand
from products.ai_restock import get_restock_recommendations


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role == 'SUPPLIER':
            return Product.objects.filter(supplier=user)
        return Product.objects.all()

    def perform_create(self, serializer):
        if self.request.user.is_authenticated and self.request.user.role == 'SUPPLIER':
            serializer.save(supplier=self.request.user)
        else:
            serializer.save()


    # Low stock API
    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        low_stock_products = self.get_queryset().filter(
            stock__lte=F('minimum_stock_level')
        )
        serializer = self.get_serializer(low_stock_products, many=True)
        return Response(serializer.data)


    # AI Demand Forecast API
    @action(detail=True, methods=['get'])
    def demand_forecast(self, request, pk=None):

        product = get_object_or_404(Product, pk=pk)

        prediction = predict_product_demand(product.id)

        return Response({
            "product_id": product.id,
            "product_name": product.name,
            "predicted_demand_next_month": prediction
        })
    
    # AI Restock Recommendations API
    @action(detail=False, methods=['get'])
    def restock_recommendations(self, request):
        recommendations = get_restock_recommendations(request.user)
        return Response(recommendations)

    # Restock a single product
    @action(detail=True, methods=['post'])
    def restock(self, request, pk=None):
        product = self.get_object()
        quantity = request.data.get('quantity', 0)
        try:
            quantity = int(quantity)
            if quantity > 0:
                product.stock += quantity
                product.save()
                return Response({'status': 'restocked', 'new_stock': product.stock})
            else:
                return Response({'error': 'Quantity must be positive'}, status=400)
        except ValueError:
            return Response({'error': 'Invalid quantity'}, status=400)