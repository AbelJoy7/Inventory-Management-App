from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import CustomUser
from .serializers import UserSerializer

class AccountsViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer