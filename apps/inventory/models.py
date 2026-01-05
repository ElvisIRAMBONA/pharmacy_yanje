from django.db import models
from apps.medicines.models import Medicine

class InventoryItem(models.Model):
    medicine = models.OneToOneField(Medicine, on_delete=models.CASCADE)
    current_stock = models.PositiveIntegerField(default=0)
    reorder_level = models.PositiveIntegerField(default=10)

    def __str__(self):
        return f"Inventory for {self.medicine.name}"
