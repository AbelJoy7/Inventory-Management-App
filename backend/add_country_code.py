import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from accounts.models import CustomUser
from suppliers.models import Supplier

# Increase max_length safely via ORM (Wait, SQLite doesn't strictly enforce varchar limits so changing models.py is enough, but we can just prepend since 14 <= 15)

def update_phones():
    print("Updating Suppliers...")
    for supplier in Supplier.objects.all():
        if supplier.phone and not supplier.phone.startswith('+'):
            supplier.phone = f"+91 {supplier.phone}"
            supplier.save()
            
    print("Updating Users...")
    for user in CustomUser.objects.all():
        if user.phone and not user.phone.startswith('+'):
            user.phone = f"+91 {user.phone}"
            user.save()
            
    print("Done")

if __name__ == '__main__':
    update_phones()
