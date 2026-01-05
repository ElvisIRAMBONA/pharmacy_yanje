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
from apps.sales.models import Sale, SaleItem
from decimal import Decimal
import random

# Create sample sales
medicines = Medicine.objects.all()[:3]  # Get first 3 medicines

if medicines:
    # Create a sample sale
    sale = Sale.objects.create(
        customer_name="John Doe",
        total_amount=Decimal('45.50'),
        discount=Decimal('5.00'),
        payment_method='cash'
    )
    
    # Add sale items
    SaleItem.objects.create(
        sale=sale,
        medicine=medicines[0],
        quantity=2,
        price=medicines[0].price
    )
    
    if len(medicines) > 1:
        SaleItem.objects.create(
            sale=sale,
            medicine=medicines[1],
            quantity=1,
            price=medicines[1].price
        )
    
    print(f"Created sale #{sale.id} for {sale.customer_name}")
    print(f"Total: ${sale.total_amount}, Final: ${sale.final_amount}")
    
    # Create another sale
    sale2 = Sale.objects.create(
        customer_name="Jane Smith",
        total_amount=Decimal('28.75'),
        discount=Decimal('0.00'),
        payment_method='card'
    )
    
    if len(medicines) > 2:
        SaleItem.objects.create(
            sale=sale2,
            medicine=medicines[2],
            quantity=3,
            price=medicines[2].price
        )
    
    print(f"Created sale #{sale2.id} for {sale2.customer_name}")
    print(f"Total: ${sale2.total_amount}, Final: ${sale2.final_amount}")
    
else:
    print("No medicines found. Please add medicines first.")