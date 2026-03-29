from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum, F
from django.db.models.functions import TruncMonth
from django.utils import timezone
from datetime import timedelta

from .models import Order, OrderItem
from .serializers import (
    OrderSerializer,
    TopProductSerializer,
    MonthlySalesSerializer,
    StockDistributionSerializer
)

from products.models import Product


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer


# -------------------------------
# Helper function for date filtering
# -------------------------------
def get_start_date(time_period):
    now = timezone.now()
    if time_period == 'today':
        return now.replace(hour=0, minute=0, second=0, microsecond=0)
    elif time_period == 'week':
        return now - timedelta(days=now.weekday(), hours=now.hour, minutes=now.minute, seconds=now.second, microseconds=now.microsecond)
    elif time_period == 'month':
        return now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    elif time_period == 'year':
        return now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
    return None

# -------------------------------
# 📊 Analytics APIs
# -------------------------------

# Top Selling Products
@api_view(['GET'])
def top_selling_products(request):
    time_period = request.GET.get('time_period', 'all')
    queryset = OrderItem.objects.all()
    start_date = get_start_date(time_period)
    
    if start_date:
        queryset = queryset.filter(order__created_at__gte=start_date)

    products = (
        queryset
        .values(product_name=F('product__name'))
        .annotate(total_sold=Sum('quantity'))
        .order_by('-total_sold')[:5]
    )

    serializer = TopProductSerializer(products, many=True)
    return Response(serializer.data)


# Monthly Sales Trend
@api_view(['GET'])
def monthly_sales(request):
    time_period = request.GET.get('time_period', 'all')
    queryset = OrderItem.objects.all()
    start_date = get_start_date(time_period)
    
    if start_date:
        queryset = queryset.filter(order__created_at__gte=start_date)

    sales = (
        queryset
        .annotate(month=TruncMonth('order__created_at'))
        .values('month')
        .annotate(total_sales=Sum('quantity'))
        .order_by('month')
    )

    serializer = MonthlySalesSerializer(sales, many=True)
    return Response(serializer.data)


# Stock Distribution
@api_view(['GET'])
def stock_distribution(request):
    stock = (
        Product.objects
        .values('category__name')
        .annotate(stock=Sum('stock'))
    )
    serializer = StockDistributionSerializer(stock, many=True)
    return Response(serializer.data)

# Dashboard Summary Stats
@api_view(['GET'])
def dashboard_summary(request):
    from products.models import Product
    from accounts.models import CustomUser
    
    time_period = request.GET.get('time_period', 'all')
    start_date = get_start_date(time_period)
    
    product_qs = Product.objects.all()
    supplier_qs = CustomUser.objects.filter(role='SUPPLIER')
    order_qs = Order.objects.all()
    
    if start_date:
        product_qs = product_qs.filter(created_at__gte=start_date)
        supplier_qs = supplier_qs.filter(date_joined__gte=start_date)
        order_qs = order_qs.filter(created_at__gte=start_date)
    
    total_products = product_qs.count()
    total_suppliers = supplier_qs.count()
    total_orders = order_qs.count()
    total_revenue = order_qs.aggregate(Sum('total_amount'))['total_amount__sum'] or 0

    return Response({
        "total_products": total_products,
        "total_suppliers": total_suppliers,
        "total_orders": total_orders,
        "total_revenue": total_revenue
    })