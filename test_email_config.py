import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pharmacy_system.settings')
django.setup()

from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

print("=== Configuration Email ===")
print(f"EMAIL_HOST_USER: {settings.EMAIL_HOST_USER or 'NON CONFIGURÉ'}")
print(f"EMAIL_HOST_PASSWORD: {'Configuré' if settings.EMAIL_HOST_PASSWORD else 'NON CONFIGURÉ'}")
print(f"DEFAULT_FROM_EMAIL: {settings.DEFAULT_FROM_EMAIL}")

print("\n=== Utilisateurs Admin ===")
admins = User.objects.filter(role='admin')
print(f"Nombre d'admins: {admins.count()}")

for admin in admins:
    print(f"- {admin.username}: email = {admin.email or 'PAS D\'EMAIL'}")

if not settings.EMAIL_HOST_USER or not settings.EMAIL_HOST_PASSWORD:
    print("\n⚠️ PROBLÈME: Les identifiants email ne sont pas configurés dans .env")
    print("\nCréez un fichier .env avec:")
    print("EMAIL_HOST_USER=votre-email@gmail.com")
    print("EMAIL_HOST_PASSWORD=votre-mot-de-passe-app")

if not any(admin.email for admin in admins):
    print("\n⚠️ PROBLÈME: Aucun admin n'a d'adresse email configurée")
