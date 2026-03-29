import os
import django
import traceback

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

try:
    with open('populate_new_suppliers.py', 'r') as f:
        exec(f.read())
except Exception as e:
    traceback.print_exc()
