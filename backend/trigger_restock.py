import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from products.models import Product
from ai.demand_forecast import predict_product_demand

products = Product.objects.all()
for p in products:
    pred = predict_product_demand(p.id)
    if isinstance(pred, (int, float)) and pred > 0:
        p.stock = max(0, int(pred) - 5)
        p.save()
        print(f"Updated {p.name}: stock={p.stock}, predicted={pred}")

print("Done lowering stock.")
