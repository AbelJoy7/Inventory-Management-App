import os
import django
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from products.models import Product
from orders.models import Order, OrderItem

# Approximate conversion rate to quickly make prices realistic in INR
USD_TO_INR = Decimal('80.00')

def update_prices():
    print("Updating product prices...")
    for p in Product.objects.all():
        p.price = p.price * USD_TO_INR
        p.save()

    print("Updating order items...")
    for item in OrderItem.objects.all():
        item.price = item.price * USD_TO_INR
        item.save()

    print("Updating orders total amount...")
    for order in Order.objects.all():
        total = sum(item.price * item.quantity for item in order.items.all())
        order.total_amount = total
        order.save()

if __name__ == '__main__':
    update_prices()
    print("All prices updated to realistic INR values.")
