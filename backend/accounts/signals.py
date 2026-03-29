from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CustomUser

@receiver(post_save, sender=CustomUser)
def create_supplier_profile(sender, instance, created, **kwargs):
    if getattr(instance, '_syncing', False):
        return

    if instance.role == 'SUPPLIER':
        from suppliers.models import Supplier
        supplier = Supplier.objects.filter(email=instance.email).first()
        if not supplier:
            supplier = Supplier(user=instance, name=instance.username, email=instance.email, phone=instance.phone)
            supplier._syncing = True
            supplier.save()
        else:
            if supplier.user != instance or supplier.phone != instance.phone or supplier.name != instance.username:
                supplier._syncing = True
                supplier.user = instance
                supplier.name = instance.username
                supplier.phone = instance.phone
                supplier.save()
