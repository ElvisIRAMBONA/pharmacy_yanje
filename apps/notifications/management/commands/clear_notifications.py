from django.core.management.base import BaseCommand
from apps.notifications.models import Notification


class Command(BaseCommand):
    help = 'Supprime toutes les notifications'

    def handle(self, *args, **options):
        count = Notification.objects.all().count()
        Notification.objects.all().delete()
        self.stdout.write(self.style.SUCCESS(f'{count} notification(s) supprimée(s)'))
