from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, top_selling_products, monthly_sales, stock_distribution

router = DefaultRouter()
router.register(r'orders', OrderViewSet)

urlpatterns = [
    path('', include(router.urls)),

    # Analytics APIs
    path('analytics/top-products/', top_selling_products),
    path('analytics/monthly-sales/', monthly_sales),
    path('analytics/stock-distribution/', stock_distribution),
]