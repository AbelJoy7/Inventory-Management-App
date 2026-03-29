import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from products.ai_restock import get_restock_recommendations
print(get_restock_recommendations())
