import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from suppliers.models import Supplier
from categories.models import Category
from products.models import Product

def create_suppliers_and_data():
    supp1, _ = Supplier.objects.get_or_create(
        email='contact@reliancefresh.in',
        defaults={
            'name': 'Reliance Fresh Supply',
            'phone': '+91 9876543210',
            'address': 'Mumbai, Maharashtra, India'
        }
    )
    
    supp2, _ = Supplier.objects.get_or_create(
        email='wholesale@tata.com',
        defaults={
            'name': 'Tata Wholesale',
            'phone': '+91 9123456780',
            'address': 'Bengaluru, Karnataka, India'
        }
    )

    print(f"Created Suppliers: {supp1.name}, {supp2.name}")

    # Add dummy products for them
    cat_groceries = Category.objects.filter(name='Groceries').first()
    cat_home = Category.objects.filter(name='Home & Kitchen').first()

    # The signals created CustomUser accounts automatically, accessible via supp1.user
    if cat_groceries and supp1.user:
        p1, _ = Product.objects.get_or_create(
            name="Reliance Fresh Atta 5kg",
            defaults={
                'description': 'Premium quality whole wheat atta.',
                'price': 250.00,
                'stock': 120,
                'minimum_stock_level': 20,
                'category': cat_groceries,
                'supplier': supp1.user
            }
        )
        print(f"Added product: {p1.name}")

    if cat_home and supp2.user:
        p2, _ = Product.objects.get_or_create(
            name="Tata Swach Water Purifier",
            defaults={
                'description': 'Advanced non-electric water purifier.',
                'price': 1500.00,
                'stock': 45,
                'minimum_stock_level': 10,
                'category': cat_home,
                'supplier': supp2.user
            }
        )
        print(f"Added product: {p2.name}")

if __name__ == '__main__':
    create_suppliers_and_data()
    print("Done adding new suppliers and data.")
