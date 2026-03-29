import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from orders.models import OrderItem
from django.db.models import Sum
from django.db.models.functions import TruncMonth

try:
    sales = OrderItem.objects.annotate(
        month=TruncMonth('order__created_at')
    ).values('month').annotate(
        total_sales=Sum('quantity')
    ).order_by('month')
    
    from orders.serializers import MonthlySalesSerializer
    serializer = MonthlySalesSerializer(sales, many=True)
    data = serializer.data
    print("SUCCESS")
    print(data)
except Exception as e:
    import traceback
    print("ERROR")
    traceback.print_exc()
