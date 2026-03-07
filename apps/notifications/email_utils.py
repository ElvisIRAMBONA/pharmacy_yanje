from django.core.mail import send_mail
from django.conf import settings


def send_notification_email(user, title, message):
    """Envoie un email de notification à l'utilisateur"""
    if not user.email:
        return False
    
    try:
        send_mail(
            subject=title,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Erreur d'envoi d'email: {e}")
        return False
