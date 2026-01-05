from django.db import models
from django.utils import timezone
from apps.suppliers.models import Supplier


class Medicine(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    batch_number = models.CharField(max_length=50, blank=True, null=True)
    expiration_date = models.DateField()
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.category})"
    
    @property
    def is_expired(self):
        """Vérifie si le médicament est périmé"""
        return self.expiration_date < timezone.now().date()
    
    @property
    def is_low_stock(self):
        """Vérifie si le stock est bas (basé sur l'inventaire)"""
        from apps.inventory.models import InventoryItem
        try:
            inventory_item = InventoryItem.objects.get(medicine=self)
            return inventory_item.current_stock <= inventory_item.reorder_level
        except InventoryItem.DoesNotExist:
            return False
