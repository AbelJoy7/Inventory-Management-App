from django.db import models
from products.models import Product


class Inventory(models.Model):

    TRANSACTION_CHOICES = [
        ('IN', 'Stock In'),
        ('OUT', 'Stock Out'),
    ]

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='inventory_transactions'
    )

    quantity = models.PositiveIntegerField()

    transaction_type = models.CharField(
        max_length=3,
        choices=TRANSACTION_CHOICES
    )

    reference = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    date = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):

        if self.transaction_type == 'IN':
            self.product.stock += self.quantity

        elif self.transaction_type == 'OUT':

            if self.product.stock < self.quantity:
                raise ValueError("Not enough stock!")

            self.product.stock -= self.quantity

        self.product.save()

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product.name} - {self.transaction_type} - {self.quantity}"