import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.test import Client
from rest_framework.test import APIClient

client = APIClient()
response = client.get('/api/analytics/summary/')

if response.status_code == 200:
    print("SUCCESS INTERNAL:", response.data)
else:
    print(f"FAILED INTERNAL {response.status_code}")
