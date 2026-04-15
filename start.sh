#!/bin/bash
# Stop execution if migrate fails
set -e

cd backend
echo "Running migrations..."
python manage.py migrate

# Admin User is already securely created, proceeding to start the app...
echo "Starting Gunicorn..."
gunicorn backend.wsgi:application
