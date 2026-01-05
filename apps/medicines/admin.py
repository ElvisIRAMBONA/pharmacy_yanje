from django.contrib import admin
from .models import Medicine

@admin.register(Medicine)
class MedicineAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'quantity', 'batch_number', 'expiration_date', 'supplier')
    list_filter = ('category', 'expiration_date', 'supplier')
    search_fields = ('name', 'category', 'batch_number')
    ordering = ('name',)

