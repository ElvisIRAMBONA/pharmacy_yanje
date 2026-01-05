from django.db import models
from apps.medicines.models import Medicine

class Sale(models.Model):
    PAYMENT_METHODS = [
        ('cash', 'Espèces'),
        ('card', 'Carte Bancaire'),
        ('insurance', 'Assurance'),
        ('transfer', 'Virement'),
        ('lumicash', 'Lumicash'),
    ]
    
    customer_name = models.CharField(max_length=255)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS, default='cash')
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Sale to {self.customer_name} on {self.date}"
    
    @property
    def final_amount(self):
        """Calcule le montant après remise"""
        return self.total_amount - self.discount

class SaleItem(models.Model):
    sale = models.ForeignKey(Sale, related_name='items', on_delete=models.CASCADE)
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.medicine.name}"
    
    @property
    def total(self):
        return self.quantity * self.price
