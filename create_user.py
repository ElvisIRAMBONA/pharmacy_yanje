#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append('/home/elvis-brown/django-projects/pharmacy_system')

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pharmacy_system.settings')
django.setup()

from apps.users.models import CustomUser

# Create test user
username = 'admin'
password = 'admin123'
email = 'admin@pharmacy.com'

if not CustomUser.objects.filter(username=username).exists():
    user = CustomUser.objects.create_user(
        username=username,
        email=email,
        password=password,
        role='admin'
    )
    print(f"Created user: {username} with password: {password}")
else:
    print(f"User {username} already exists")