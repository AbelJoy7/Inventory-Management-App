import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from products.models import Product
from django.db.models import F, Sum
from orders.serializers import StockDistributionSerializer

try:
    stock = (
        Product.objects
        .values(name=F('category__name'))
        .annotate(stock=Sum('stock'))
    )
    print("Queryset:", list(stock))
    serializer = StockDistributionSerializer(stock, many=True)
    print("Serialized:", serializer.data)
except Exception as e:
    import traceback
    traceback.print_exc()
