from rest_framework import serializers
from .models import Sale, SaleItem
from apps.medicines.models import Medicine

class SaleItemSerializer(serializers.ModelSerializer):
    medicine_name = serializers.CharField(source='medicine.name', read_only=True)
    
    class Meta:
        model = SaleItem
        fields = ['id', 'medicine', 'medicine_name', 'quantity', 'price']

class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(many=True, read_only=True)
    items_data = serializers.ListField(write_only=True, required=False)
    final_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    
    class Meta:
        model = Sale
        fields = ['id', 'customer_name', 'total_amount', 'discount', 'final_amount', 
                  'payment_method', 'payment_method_display', 'date', 'items', 'items_data']
    
    def create(self, validated_data):
        items_data = validated_data.pop('items_data', [])
        sale = Sale.objects.create(**validated_data)
        
        for item_data in items_data:
            medicine = Medicine.objects.get(id=item_data['medicine_id'])
            SaleItem.objects.create(
                sale=sale,
                medicine=medicine,
                quantity=item_data['quantity'],
                price=item_data['price']
            )
        
        return sale

