from django.db import models
from categories.models import Category

# Create your models here.from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    minimum_stock_level = models.IntegerField(default=5)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")
    supplier = models.ForeignKey('accounts.CustomUser', on_delete=models.SET_NULL, null=True, blank=True, related_name="supplied_products")
    image = models.ImageField(upload_to="products/", blank=True, null=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
    def get_stock_status(self):
        if self.stock == 0:
            return "OUT OF STOCK"
        elif self.stock <= self.minimum_stock_level:
            return "LOW STOCK"
        else:
            return "IN STOCK"
