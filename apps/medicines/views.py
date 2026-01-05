from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Medicine
from .serializers import MedicineSerializer
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from apps.users.permissions import IsAdminOrPharmacist

class MedicineListCreateAPIView(APIView):
    """GET all medicines | POST new medicine"""
    permission_classes = [IsAuthenticated, IsAdminOrPharmacist]

    def get(self, request):
        medicines = Medicine.objects.all()
        serializer = MedicineSerializer(medicines, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = MedicineSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MedicineDetailAPIView(APIView):
    """GET, PUT, DELETE for a single medicine"""
    permission_classes = [IsAuthenticated, IsAdminOrPharmacist]

    def get(self, request, pk):
        medicine = get_object_or_404(Medicine, pk=pk)
        serializer = MedicineSerializer(medicine)
        return Response(serializer.data)

    def put(self, request, pk):
        medicine = get_object_or_404(Medicine, pk=pk)
        serializer = MedicineSerializer(medicine, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        medicine = get_object_or_404(Medicine, pk=pk)
        medicine.delete()
        return Response({"message": "Medicine deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


class ExpiredMedicinesAPIView(APIView):
    """GET all expired medicines"""
    permission_classes = [IsAuthenticated, IsAdminOrPharmacist]

    def get(self, request):
        expired_medicines = Medicine.objects.filter(expiration_date__lt=timezone.now().date())
        serializer = MedicineSerializer(expired_medicines, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
