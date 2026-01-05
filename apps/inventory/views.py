from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from apps.users.permissions import IsAdminOrPharmacist
from .models import InventoryItem
from .serializers import InventoryItemSerializer
from apps.medicines.models import Medicine


class InventoryListCreateAPIView(APIView):
    """GET all inventory items | POST new inventory item"""
    permission_classes = [IsAuthenticated, IsAdminOrPharmacist]

    def get(self, request):
        inventory_items = InventoryItem.objects.all()
        serializer = InventoryItemSerializer(inventory_items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = InventoryItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InventoryDetailAPIView(APIView):
    """GET, PUT, DELETE for a single inventory item"""
    permission_classes = [IsAuthenticated, IsAdminOrPharmacist]

    def get(self, request, pk):
        inventory_item = get_object_or_404(InventoryItem, pk=pk)
        serializer = InventoryItemSerializer(inventory_item)
        return Response(serializer.data)

    def put(self, request, pk):
        inventory_item = get_object_or_404(InventoryItem, pk=pk)
        serializer = InventoryItemSerializer(inventory_item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        inventory_item = get_object_or_404(InventoryItem, pk=pk)
        inventory_item.delete()
        return Response({"message": "Inventory item deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


class LowStockAlertAPIView(APIView):
    """GET items with low stock"""
    permission_classes = [IsAuthenticated, IsAdminOrPharmacist]

    def get(self, request):
        from django.db.models import F
        low_stock_items = InventoryItem.objects.filter(
            current_stock__lte=F('reorder_level')
        )
        serializer = InventoryItemSerializer(low_stock_items, many=True)
        return Response({
            "count": low_stock_items.count(),
            "items": serializer.data
        }, status=status.HTTP_200_OK)


class InventoryStatsAPIView(APIView):
    """GET inventory statistics"""
    permission_classes = [IsAuthenticated, IsAdminOrPharmacist]

    def get(self, request):
        from django.db.models import F
        total_items = InventoryItem.objects.count()
        low_stock_count = InventoryItem.objects.filter(
            current_stock__lte=F('reorder_level')
        ).count()
        
        low_stock = InventoryItem.objects.filter(
            current_stock__lte=F('reorder_level')
        ).select_related('medicine')
        
        low_stock_list = []
        for item in low_stock:
            low_stock_list.append({
                "medicine": item.medicine.name,
                "current_stock": item.current_stock,
                "reorder_level": item.reorder_level,
                "category": item.medicine.category
            })
        
        return Response({
            "total_items": total_items,
            "low_stock_count": low_stock_count,
            "low_stock_items": low_stock_list
        }, status=status.HTTP_200_OK)

