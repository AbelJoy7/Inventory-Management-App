from rest_framework import serializers
from .models import Inventory

class InventorySerializer(serializers.ModelSerializer):
    product_name = serializers.StringRelatedField(source='product.name', read_only=True)
    
    class Meta:
        model = Inventory
        fields = '__all__'