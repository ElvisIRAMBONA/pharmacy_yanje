from rest_framework import serializers
from .models import Medicine
from apps.inventory.models import InventoryItem

class MedicineSerializer(serializers.ModelSerializer):
    is_expired = serializers.BooleanField(read_only=True)
    is_low_stock = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Medicine
        fields = [
            "id",
            "name",
            "category",
            "price",
            "quantity",
            "batch_number",
            "expiration_date",
            "supplier",
            "is_expired",
            "is_low_stock",
        ]
    
      
    def create(self, validated_data):
        quantity = validated_data.get("quantity", 0)

        medicine = Medicine.objects.create(**validated_data)

        InventoryItem.objects.create(
          medicine=medicine,
          current_stock=quantity,
          reorder_level=10
       )

        return medicine