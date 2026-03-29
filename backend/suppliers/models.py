# Create your models here.
from django.db import models

class Supplier(models.Model):
    user = models.OneToOneField('accounts.CustomUser', on_delete=models.CASCADE, related_name='supplier_profile', null=True, blank=True)
    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=15)
    email = models.EmailField(unique=True)
    address = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name