from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from accounts.tokens import CustomTokenObtainPairView

from products.views import ProductViewSet
from inventory.views import InventoryViewSet
from suppliers.views import SupplierViewSet
from accounts.views import AccountsViewSet
from categories.views import CategoryViewSet
from orders.views import OrderViewSet, top_selling_products, monthly_sales, stock_distribution, dashboard_summary


router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'inventory', InventoryViewSet)
router.register(r'suppliers', SupplierViewSet)
router.register(r'accounts', AccountsViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'orders', OrderViewSet)


urlpatterns = [
    path('admin/', admin.site.urls),

    # Authentication APIs
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # ViewSets
    path('api/', include(router.urls)),

    # Analytics APIs
    path('api/analytics/top-products/', top_selling_products),
    path('api/analytics/monthly-sales/', monthly_sales),
    path('api/analytics/stock-distribution/', stock_distribution),
    path('api/analytics/summary/', dashboard_summary),
]