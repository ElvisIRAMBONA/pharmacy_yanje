#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append('/home/elvis-brown/django-projects/pharmacy_system')

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pharmacy_system.settings')
django.setup()

from apps.medicines.models import Medicine
from apps.inventory.models import InventoryItem
import random

# Create inventory items for medicines that don't have them
medicines = Medicine.objects.all()
created_count = 0

for medicine in medicines:
    if not hasattr(medicine, 'inventoryitem'):
        # Create inventory item with random stock levels
        current_stock = random.randint(5, 100)
        reorder_level = random.randint(10, 30)
        
        InventoryItem.objects.create(
            medicine=medicine,
            current_stock=current_stock,
            reorder_level=reorder_level
        )
        created_count += 1
        print(f"Created inventory for {medicine.name}: Stock={current_stock}, Reorder={reorder_level}")

print(f"\nCreated {created_count} inventory items")