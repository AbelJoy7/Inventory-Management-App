from django.urls import path
from .views import top_selling_products, monthly_sales, stock_distribution

urlpatterns = [
    path('top-products/', top_selling_products),
    path('monthly-sales/', monthly_sales),
    path('stock-distribution/', stock_distribution),
]