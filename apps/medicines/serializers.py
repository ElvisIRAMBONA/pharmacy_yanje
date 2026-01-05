from rest_framework import serializers
from .models import Medicine
from apps.inventory.models import InventoryItem

class MedicineSerializer(serializers.ModelSerializer):
    is_expired = serializers.BooleanField(read_only=True)
    is_low_stock = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Medicine
        fields = '__all__'
    
    def create(self, validated_data):
        # Create the medicine
        medicine = Medicine.objects.create(**validated_data)
        
        # Create corresponding inventory item
        InventoryItem.objects.create(
            medicine=medicine,
            current_stock=medicine.quantity,
            reorder_level=10  # Default reorder level
        )
        
        return medicine
