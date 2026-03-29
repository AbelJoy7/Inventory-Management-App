import os
import django
import random
from datetime import timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.utils import timezone
from suppliers.models import Supplier
from categories.models import Category
from products.models import Product
from orders.models import Order, OrderItem
from inventory.models import Inventory
from accounts.models import CustomUser

def populate():
    supp1 = Supplier.objects.filter(name__icontains='Reliance Fresh').first()
    supp2 = Supplier.objects.filter(name__icontains='Tata Wholesale').first()
    
    user1 = supp1.user if supp1 else CustomUser.objects.first()
    user2 = supp2.user if supp2 else CustomUser.objects.first()

    cat_groc, _ = Category.objects.get_or_create(name='Groceries', defaults={'description': 'Food and groceries'})
    cat_cloth, _ = Category.objects.get_or_create(name='Clothing', defaults={'description': 'Apparel'})
    cat_elec, _ = Category.objects.get_or_create(name='Electronics', defaults={'description': 'Gadgets'})

    new_products1 = [
        {'name': 'Reliance Basmati Rice 10kg', 'desc': 'Long grain premium basmati', 'price': 1200.00, 'stock': 400, 'min_stock': 50, 'cat': cat_groc},
        {'name': 'Reliance Cold Pressed Mustard Oil', 'desc': 'Pure kachi ghani oil', 'price': 350.00, 'stock': 150, 'min_stock': 30, 'cat': cat_groc},
        {'name': 'Reliance Trends Cotton Kurta', 'desc': '100% Cotton festive wear', 'price': 1499.00, 'stock': 60, 'min_stock': 15, 'cat': cat_cloth},
    ]

    new_products2 = [
        {'name': 'Tata Salt 1kg', 'desc': 'Iodized vacuum evaporated salt', 'price': 25.00, 'stock': 1000, 'min_stock': 200, 'cat': cat_groc},
        {'name': 'Tata Tea Premium 500g', 'desc': 'Desh ki chai', 'price': 280.00, 'stock': 300, 'min_stock': 50, 'cat': cat_groc},
        {'name': 'Croma 32-inch LED TV', 'desc': 'HD ready smart TV', 'price': 12500.00, 'stock': 25, 'min_stock': 5, 'cat': cat_elec},
    ]

    all_new_prods = []
    print("Adding Products and IN Logs...")
    
    for p in new_products1:
        try:
            prod, created = Product.objects.get_or_create(
                name=p['name'],
                defaults={
                    'description': p['desc'], 'price': p['price'], 'stock': p['stock'],
                    'minimum_stock_level': p['min_stock'], 'category': p['cat'], 'supplier': user1
                }
            )
            if created:
                all_new_prods.append(prod)
                Inventory.objects.create(product=prod, quantity=p['stock'], transaction_type='IN', reference='Initial Bulk Import')
        except Exception as e:
            print("Failed to create", p['name'], e)

    for p in new_products2:
        try:
            prod, created = Product.objects.get_or_create(
                name=p['name'],
                defaults={
                    'description': p['desc'], 'price': p['price'], 'stock': p['stock'],
                    'minimum_stock_level': p['min_stock'], 'category': p['cat'], 'supplier': user2
                }
            )
            if created:
                all_new_prods.append(prod)
                Inventory.objects.create(product=prod, quantity=p['stock'], transaction_type='IN', reference='Initial Bulk Import')
        except Exception as e:
            print("Failed to create", p['name'], e)

    if not all_new_prods:
        all_new_prods = list(Product.objects.filter(supplier__in=[user1, user2]))

    print("Generating Orders and OUT Logs...")
    for i in range(25):
        order = Order.objects.create()
        random_days_ago = random.randint(1, 28)
        past_date = timezone.now() - timedelta(days=random_days_ago) 
        
        num_items = random.randint(1, 4)
        chosen_prods = random.sample(all_new_prods, min(num_items, len(all_new_prods)))
        
        total = 0
        for cp in chosen_prods:
            qty = random.randint(1, 6)
            price = cp.price
            total += price * qty
            
            OrderItem.objects.create(order=order, product=cp, quantity=qty, price=price)
            Inventory.objects.create(product=cp, quantity=qty, transaction_type='OUT', reference=f'Order #{order.id}')
            cp.stock = max(0, cp.stock - qty)
            cp.save()
            
        order.total_amount = total
        order.save()
        
        Order.objects.filter(id=order.id).update(created_at=past_date)
        Inventory.objects.filter(reference=f'Order #{order.id}').update(date=past_date)

    print("Success. Refresh dashboard.")

if __name__ == '__main__':
    populate()
