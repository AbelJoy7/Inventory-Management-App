
# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):

    ROLE_CHOICES = [
        ('ADMIN', 'Admin'),
        ('STAFF', 'Staff'),
        ('SUPPLIER', 'Supplier'),
    ]

    phone = models.CharField(max_length=15, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='STAFF')

    def __str__(self):
        return self.username