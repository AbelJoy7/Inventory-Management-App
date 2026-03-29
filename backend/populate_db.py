import os
import django
import random
from decimal import Decimal
from datetime import timedelta
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from accounts.models import CustomUser
from categories.models import Category as AppCategory
from products.models import Product, Category as ProductCategory
from orders.models import Order, OrderItem
from suppliers.models import Supplier

def populate():
    print("Clearing old data...")
    Order.objects.all().delete()
    Product.objects.all().delete()
    ProductCategory.objects.all().delete()
    AppCategory.objects.all().delete()
    Supplier.objects.all().delete()
    CustomUser.objects.filter(is_superuser=False).delete()

    print("Creating Users...")
    admin = CustomUser.objects.filter(username='admin').first()
    if not admin:
        admin = CustomUser.objects.create_superuser('admin', 'admin@example.com', 'adminpass')
        admin.role = 'ADMIN'
        admin.save()

    staff1 = CustomUser.objects.create_user('staff1', 'staff1@example.com', 'password123', role='STAFF')
    supplier_user1 = CustomUser.objects.create_user('suppuser1', 'supp1@example.com', 'password123', role='SUPPLIER')
    supplier_user2 = CustomUser.objects.create_user('suppuser2', 'supp2@example.com', 'password123', role='SUPPLIER')

    print("Creating Categories...")
    # Because products/models.py redefines Category, we must use ProductCategory
    cat_electronics = ProductCategory.objects.create(name="Electronics", description="Gadgets and devices")
    cat_groceries = ProductCategory.objects.create(name="Groceries", description="Food and daily needs")
    cat_clothing = ProductCategory.objects.create(name="Clothing", description="Apparel")

    # Also create them in categories app just in case
    AppCategory.objects.create(name="Electronics", description="Gadgets and devices")
    AppCategory.objects.create(name="Groceries", description="Food and daily needs")
    AppCategory.objects.create(name="Clothing", description="Apparel")

    print("Creating Suppliers (Model)...")
    sup1 = Supplier.objects.create(name="Tech Supply Co", phone="123456789", email="tech@supply.com", address="123 Tech St")
    sup2 = Supplier.objects.create(name="Fresh Foods", phone="987654321", email="fresh@foods.com", address="456 Food Ave")

    print("Creating Products...")
    products_data = [
        {"name": "Laptop Pro", "desc": "High performance laptop", "price": 1200.00, "stock": 15, "min_stock": 5, "cat": cat_electronics, "sup": supplier_user1},
        {"name": "Smartphone X", "desc": "Latest model smartphone", "price": 800.00, "stock": 3, "min_stock": 10, "cat": cat_electronics, "sup": supplier_user1},
        {"name": "Fresh Apples", "desc": "Fresh red apples", "price": 2.50, "stock": 100, "min_stock": 20, "cat": cat_groceries, "sup": supplier_user2},
        {"name": "Whole Wheat Bread", "desc": "Whole wheat bread", "price": 3.00, "stock": 40, "min_stock": 15, "cat": cat_groceries, "sup": supplier_user2},
        {"name": "Basic T-Shirt", "desc": "Cotton black t-shirt", "price": 15.00, "stock": 50, "min_stock": 10, "cat": cat_clothing, "sup": supplier_user1},
        {"name": "Denim Jeans", "desc": "Blue denim jeans", "price": 40.00, "stock": 25, "min_stock": 5, "cat": cat_clothing, "sup": supplier_user2},
        {"name": "Wireless Mouse", "desc": "Bluetooth wireless mouse", "price": 25.00, "stock": 2, "min_stock": 15, "cat": cat_electronics, "sup": supplier_user1},
        {"name": "Organic Milk", "desc": "1 Gallon organic milk", "price": 4.50, "stock": 8, "min_stock": 20, "cat": cat_groceries, "sup": supplier_user2},
    ]

    prods = []
    for pd in products_data:
        p = Product.objects.create(
            name=pd["name"],
            description=pd["desc"],
            price=Decimal(str(pd["price"])),
            stock=pd["stock"],
            minimum_stock_level=pd["min_stock"],
            category=pd["cat"],
            supplier=pd["sup"]
        )
        prods.append(p)

    print("Creating Orders...")
    for _ in range(15):
        order = Order.objects.create()
        num_items = random.randint(1, 4)
        order_total = Decimal('0.00')
        selected_prods = random.sample(prods, num_items)
        
        for p in selected_prods:
            qty = random.randint(1, 3)
            price = p.price
            OrderItem.objects.create(
                order=order,
                product=p,
                quantity=qty,
                price=price
            )
            order_total += price * qty
        
        order.total_amount = order_total
        order.save()
        
        past_date = timezone.now() - timedelta(days=random.randint(1, 30))
        Order.objects.filter(id=order.id).update(created_at=past_date)

    print("Database populated successfully!")

if __name__ == '__main__':
    populate()
