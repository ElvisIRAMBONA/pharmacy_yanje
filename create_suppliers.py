#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append('/home/elvis-brown/django-projects/pharmacy_system')

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pharmacy_system.settings')
django.setup()

from apps.suppliers.models import Supplier
from datetime import datetime

# Create sample suppliers
suppliers_data = [
    {
        'name': 'PharmaCorp Ltd',
        'contact_info': '+1-555-0123',
        'address': '123 Medical Street, New York, NY 10001',
        'email': 'contact@pharmacorp.com'
    },
    {
        'name': 'MediSupply Inc',
        'contact_info': '+1-555-0456',
        'address': '456 Health Avenue, Los Angeles, CA 90210',
        'email': 'orders@medisupply.com'
    },
    {
        'name': 'Global Pharma Solutions',
        'contact_info': '+1-555-0789',
        'address': '789 Wellness Blvd, Chicago, IL 60601',
        'email': 'info@globalpharma.com'
    }
]

created_count = 0
for supplier_data in suppliers_data:
    supplier, created = Supplier.objects.get_or_create(
        name=supplier_data['name'],
        defaults={
            'contact_info': supplier_data['contact_info'],
            'address': supplier_data['address'],
            'email': supplier_data['email'],
            'created_at': datetime.now()
        }
    )
    if created:
        created_count += 1
        print(f"Created supplier: {supplier.name}")
    else:
        print(f"Supplier already exists: {supplier.name}")

print(f"\nTotal suppliers created: {created_count}")
print(f"Total suppliers in database: {Supplier.objects.count()}")