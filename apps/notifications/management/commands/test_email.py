from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'Test l\'envoi d\'email'

    def handle(self, *args, **options):
        self.stdout.write("=== Test Email ===")
        self.stdout.write(f"EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}")
        self.stdout.write(f"EMAIL_HOST_PASSWORD: {'Configuré' if settings.EMAIL_HOST_PASSWORD else 'NON CONFIGURÉ'}")
        
        admins = User.objects.filter(role='admin')
        
        for admin in admins:
            if admin.email:
                try:
                    send_mail(
                        subject='Test Notification Pharmacy',
                        message='Ceci est un email de test. Le système de notifications fonctionne !',
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[admin.email],
                        fail_silently=False,
                    )
                    self.stdout.write(self.style.SUCCESS(f'✅ Email envoyé à {admin.email}'))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'❌ Erreur: {e}'))
            else:
                self.stdout.write(self.style.WARNING(f'⚠️ {admin.username} n\'a pas d\'email'))
