from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Supplier
from accounts.models import CustomUser
import random
import string

@receiver(post_save, sender=Supplier)
def create_or_update_user(sender, instance, created, **kwargs):
    if getattr(instance, '_syncing', False):
        return

    if instance.user:
        user = instance.user
        user._syncing = True
        CustomUser.objects.filter(id=user.id).update(
            email=instance.email,
            phone=instance.phone,
            username=instance.name.replace(" ", "").lower()
        )
    else:
        # See if user already exists
        user = CustomUser.objects.filter(email=instance.email).first()
        if user:
            user._syncing = True
            user.phone = instance.phone
            user.username = instance.name.replace(" ", "").lower()
            user.role = 'SUPPLIER'
            user.save()
            Supplier.objects.filter(id=instance.id).update(user=user)
        else:
            base_username = instance.name.replace(" ", "").lower()
            if not base_username:
                base_username = "supplier"
                
            username = base_username
            counter = 1
            while CustomUser.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1
                
            password = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
            
            user = CustomUser(
                username=username,
                email=instance.email,
                role='SUPPLIER',
                phone=instance.phone
            )
            user.set_password(password)
            user._syncing = True
            user.save()
            
            Supplier.objects.filter(id=instance.id).update(user=user)
