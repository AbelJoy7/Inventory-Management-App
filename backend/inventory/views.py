from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Inventory
from .serializers import InventorySerializer


class InventoryViewSet(viewsets.ModelViewSet):

    queryset = Inventory.objects.all().order_by('-date')
    serializer_class = InventorySerializer