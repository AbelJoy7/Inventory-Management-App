import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from suppliers.models import Supplier
from accounts.models import CustomUser

def sync_data():
    print("Syncing existing users to suppliers...")
    users = CustomUser.objects.filter(role='SUPPLIER')
    for u in users:
        supp = Supplier.objects.filter(email=u.email).first()
        if supp:
            # Temporarily disable signals internally by setting _syncing
            supp._syncing = True
            supp.user = u
            supp.save()
        else:
            supp = Supplier(user=u, name=u.username, email=u.email, phone=u.phone)
            supp._syncing = True
            try:
                supp.save()
            except Exception as e:
                print(f"Skipped {u.email} due to error: {e}")
    
    print("Syncing existing suppliers to users...")
    suppliers = Supplier.objects.filter(user__isnull=True)
    for s in suppliers:
        user = CustomUser.objects.filter(email=s.email).first()
        if user:
            s._syncing = True
            s.user = user
            s.save()
            user._syncing = True
            user.role = 'SUPPLIER'
            user.save()
        else:
            base = s.name.replace(' ', '').lower()
            username = base if base else "suppuser"
            counter = 1
            while CustomUser.objects.filter(username=username).exists():
                username = f"{base}{counter}"
                counter += 1
            
            user = CustomUser(
                username=username,
                email=s.email,
                role='SUPPLIER',
                phone=s.phone
            )
            user.set_password('supplier123')
            user._syncing = True
            user.save()
            s._syncing = True
            s.user = user
            s.save()

    print("Sync complete.")

if __name__ == '__main__':
    sync_data()
