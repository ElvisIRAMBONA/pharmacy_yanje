from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('low_stock', 'Low Stock'),
        ('sale', 'New Sale'),
        ('system', 'System'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES, default='system')
    title = models.CharField(max_length=255)
    message = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    is_read = models.BooleanField(default=False)
    related_object_id = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
            models.Index(fields=['-created_at']),
        ]

    def __str__(self):
        return f"{self.title} - {self.user.username}"

    @classmethod
    def create_low_stock_notification(cls, inventory_item, new_stock):
        """Create a low stock notification for admin users"""
        admins = User.objects.filter(role='admin')
        medicine_name = inventory_item.medicine.name
        reorder_level = inventory_item.reorder_level

        for admin_user in admins:
            # Check if there's already an unread notification for this medicine
            existing = cls.objects.filter(
                user=admin_user,
                notification_type='low_stock',
                related_object_id=inventory_item.medicine.id,
                is_read=False
            ).first()

            if not existing:
                # Calculate priority based on how low the stock is
                if new_stock == 0:
                    priority = 'critical'
                elif new_stock <= reorder_level / 2:
                    priority = 'high'
                else:
                    priority = 'medium'

                cls.objects.create(
                    user=admin_user,
                    notification_type='low_stock',
                    title=f'⚠️ Low Stock Alert: {medicine_name}',
                    message=f'The stock for {medicine_name} has fallen to {new_stock} units (reorder level: {reorder_level}). Please reorder soon.',
                    priority=priority,
                    related_object_id=inventory_item.medicine.id
                )

