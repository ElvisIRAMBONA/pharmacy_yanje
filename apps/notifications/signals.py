from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.inventory.models import InventoryItem
from apps.medicines.models import Medicine
from .models import Notification


@receiver(post_save, sender=InventoryItem)
def check_low_stock(sender, instance, **kwargs):
    """Vérifie le stock bas après chaque mise à jour d'inventaire"""
    if instance.current_stock <= instance.reorder_level:
        Notification.create_low_stock_notification(instance, instance.current_stock)


@receiver(post_save, sender=Medicine)
def check_expired_medicine(sender, instance, created, **kwargs):
    """Vérifie si le médicament est expiré"""
    if instance.is_expired:
        Notification.create_expired_notification(instance)
