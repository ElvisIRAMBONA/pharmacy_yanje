from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from apps.users.permissions import IsAdmin
from .models import Supplier, PurchaseOrder, PurchaseOrderItem
from .serializers import SupplierSerializer, PurchaseOrderSerializer, PurchaseOrderItemSerializer


class SupplierListCreateAPIView(APIView):
    """GET all suppliers | POST new supplier"""
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        suppliers = Supplier.objects.filter(is_active=True)
        serializer = SupplierSerializer(suppliers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = SupplierSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SupplierDetailAPIView(APIView):
    """GET, PUT, DELETE for a single supplier"""
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request, pk):
        supplier = get_object_or_404(Supplier, pk=pk)
        serializer = SupplierSerializer(supplier)
        return Response(serializer.data)

    def put(self, request, pk):
        supplier = get_object_or_404(Supplier, pk=pk)
        serializer = SupplierSerializer(supplier, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        supplier = get_object_or_404(Supplier, pk=pk)
        supplier.is_active = False
        supplier.save()
        return Response({"message": "Supplier deactivated successfully."}, status=status.HTTP_200_OK)


class PurchaseOrderListCreateAPIView(APIView):
    """GET all purchase orders | POST new purchase order"""
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        purchase_orders = PurchaseOrder.objects.all()
        serializer = PurchaseOrderSerializer(purchase_orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = PurchaseOrderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PurchaseOrderDetailAPIView(APIView):
    """GET, PUT, DELETE for a single purchase order"""
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request, pk):
        purchase_order = get_object_or_404(PurchaseOrder, pk=pk)
        serializer = PurchaseOrderSerializer(purchase_order)
        return Response(serializer.data)

    def put(self, request, pk):
        purchase_order = get_object_or_404(PurchaseOrder, pk=pk)
        serializer = PurchaseOrderSerializer(purchase_order, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        purchase_order = get_object_or_404(PurchaseOrder, pk=pk)
        purchase_order.delete()
        return Response({"message": "Purchase order deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

