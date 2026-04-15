#!/bin/bash
# Stop execution if migrate fails
set -e

cd backend
echo "Running migrations..."
python manage.py migrate

echo "Creating superuser..."
# The || true ensures that if createsuperuser fails (e.g. user already exists), the script continues
python manage.py createsuperuser --noinput || true

echo "Starting Gunicorn..."
gunicorn backend.wsgi:application
