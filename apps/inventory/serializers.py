from rest_framework import serializers
from .models import InventoryItem
from apps.medicines.serializers import MedicineSerializer

class InventoryItemSerializer(serializers.ModelSerializer):
    medicine = MedicineSerializer(read_only=True)
    medicine_name = serializers.CharField(source='medicine.name', read_only=True)

    class Meta:
        model = InventoryItem
        fields = '__all__'
