import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from products.models import Product

def update_stock():
    for p in Product.objects.all():
        if p.stock < 10:
            p.stock += 30
        p.save()
    print("Stock restored for visual rendering.")

if __name__ == '__main__':
    update_stock()
