import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from inventory.models import Inventory
from products.models import Product

def populate():
    print("Clearing old inventory records...")
    Inventory.objects.all().delete()

    products = list(Product.objects.all())
    if not products:
        print("No products available to log.")
        return

    print("Creating Inventory Logs...")
    for _ in range(20):
        prod = random.choice(products)
        ttype = random.choice(['IN', 'OUT'])
        qty = random.randint(1, 15)

        # For IN, it's always fine. For OUT, need to make sure we don't drop below 0
        if ttype == 'OUT' and prod.stock < qty:
            qty = prod.stock  # only take what's left
            if qty == 0:
                continue

        Inventory.objects.create(
            product=prod,
            quantity=qty,
            transaction_type=ttype,
            reference=f"REF-{random.randint(1000, 9999)}"
        )

    print("Inventory Populated!")

if __name__ == '__main__':
    populate()
