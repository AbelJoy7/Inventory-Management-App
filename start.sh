#!/bin/bash
# Stop execution if migrate fails
set -e

cd backend
echo "Running migrations..."
python manage.py migrate

echo "Ensuring Admin User Exists..."
python -c "
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()

username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'Admin123!@')

try:
    user = User.objects.get(username=username)
    user.set_password(password)
    user.is_staff = True
    user.is_superuser = True
    user.save()
    print('✅ Admin user password forcefully updated.')
except User.DoesNotExist:
    user = User.objects.create_superuser(username=username, email='admin@example.com', password=password)
    print('✅ Admin user forcefully created.')
" || true

echo "Starting Gunicorn..."
gunicorn backend.wsgi:application
