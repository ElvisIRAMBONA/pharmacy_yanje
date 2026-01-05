from django.contrib import admin
from .models import Sale, SaleItem

class SaleItemInline(admin.TabularInline):
    model = SaleItem
    extra = 0

@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ('customer_name', 'total_amount', 'date')
    list_filter = ('date',)
    search_fields = ('customer_name',)
    ordering = ('-date',)
    inlines = [SaleItemInline]

@admin.register(SaleItem)
class SaleItemAdmin(admin.ModelAdmin):
    list_display = ('sale', 'medicine', 'quantity', 'price')
    list_filter = ('sale__date',)
    search_fields = ('medicine__name', 'sale__customer_name')
    ordering = ('sale__date',)
