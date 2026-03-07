from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.medicines.models import Medicine
from apps.notifications.models import Notification


class Command(BaseCommand):
    help = 'Vérifie tous les médicaments expirés et crée des notifications'

    def handle(self, *args, **options):
        today = timezone.now().date()
        expired_medicines = Medicine.objects.filter(expiration_date__lt=today)
        
        count = 0
        for medicine in expired_medicines:
            Notification.create_expired_notification(medicine)
            count += 1
        
        self.stdout.write(
            self.style.SUCCESS(f'{count} notification(s) créée(s) pour médicaments expirés')
        )
