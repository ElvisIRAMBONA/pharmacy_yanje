from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from apps.users.permissions import IsAdminOrPharmacist
from .models import Sale, SaleItem
from .serializers import SaleSerializer, SaleItemSerializer
from apps.medicines.models import Medicine
from django.utils import timezone
from datetime import timedelta


class SaleListCreateAPIView(APIView):
    """GET all sales | POST new sale"""
    permission_classes = [IsAuthenticated, IsAdminOrPharmacist]

    def get(self, request):
        sales = Sale.objects.all().order_by('-date')
        serializer = SaleSerializer(sales, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = SaleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SaleDetailAPIView(APIView):
    """GET, PUT, DELETE for a single sale"""
    permission_classes = [IsAuthenticated, IsAdminOrPharmacist]

    def get(self, request, pk):
        sale = get_object_or_404(Sale, pk=pk)
        serializer = SaleSerializer(sale)
        return Response(serializer.data)

    def put(self, request, pk):
        sale = get_object_or_404(Sale, pk=pk)
        serializer = SaleSerializer(sale, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        sale = get_object_or_404(Sale, pk=pk)
        sale.delete()
        return Response({"message": "Sale deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


class DailySalesReportAPIView(APIView):
    """GET daily sales report"""
    permission_classes = [IsAuthenticated, IsAdminOrPharmacist]

    def get(self, request):
        date_str = request.query_params.get('date', timezone.now().date().isoformat())
        from datetime import datetime
        try:
            report_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            report_date = timezone.now().date()
        
        start_of_day = timezone.make_aware(
            datetime.combine(report_date, timezone.now().time().min)
        )
        end_of_day = timezone.make_aware(
            datetime.combine(report_date, timezone.now().time().max)
        )
        
        sales = Sale.objects.filter(date__range=[start_of_day, end_of_day])
        
        total_sales = sales.count()
        total_amount = sum(sale.final_amount for sale in sales)
        total_discount = sum(sale.discount for sale in sales)
        
        payment_methods = {}
        for sale in sales:
            method = sale.get_payment_method_display()
            if method not in payment_methods:
                payment_methods[method] = {'count': 0, 'amount': 0}
            payment_methods[method]['count'] += 1
            payment_methods[method]['amount'] += float(sale.final_amount)
        
        return Response({
            "date": report_date.isoformat(),
            "total_sales": total_sales,
            "total_amount": total_amount,
            "total_discount": total_discount,
            "payment_methods": payment_methods
        }, status=status.HTTP_200_OK)


class MonthlySalesReportAPIView(APIView):
    """GET monthly sales report"""
    permission_classes = [IsAuthenticated, IsAdminOrPharmacist]

    def get(self, request):
        year = int(request.query_params.get('year', timezone.now().year))
        month = int(request.query_params.get('month', timezone.now().month))
        
        from datetime import datetime, date
        start_of_month = date(year, month, 1)
        if month == 12:
            end_of_month = date(year + 1, 1, 1)
        else:
            end_of_month = date(year, month + 1, 1)
        
        sales = Sale.objects.filter(date__date__gte=start_of_month, date__date__lt=end_of_month)
        
        total_sales = sales.count()
        total_amount = sum(sale.final_amount for sale in sales)
        total_discount = sum(sale.discount for sale in sales)
        
        daily_sales = {}
        for sale in sales:
            day = sale.date.date().isoformat()
            if day not in daily_sales:
                daily_sales[day] = {'count': 0, 'amount': 0}
            daily_sales[day]['count'] += 1
            daily_sales[day]['amount'] += float(sale.final_amount)
        
        return Response({
            "month": f"{year}-{month:02d}",
            "total_sales": total_sales,
            "total_amount": total_amount,
            "total_discount": total_discount,
            "daily_breakdown": daily_sales
        }, status=status.HTTP_200_OK)


class ExpiredMedicinesAPIView(APIView):
    """GET expired medicines list"""
    permission_classes = [IsAuthenticated, IsAdminOrPharmacist]

    def get(self, request):
        from django.utils import timezone
        from apps.medicines.models import Medicine
        
        expired_medicines = Medicine.objects.filter(
            expiration_date__lt=timezone.now().date()
        )
        
        expired_list = []
        for med in expired_medicines:
            expired_list.append({
                "id": med.id,
                "name": med.name,
                "category": med.category,
                "expiration_date": med.expiration_date,
                "batch_number": med.batch_number,
                "quantity": med.quantity,
                "supplier": med.supplier.name if med.supplier else None
            })
        
        return Response({
            "count": expired_medicines.count(),
            "expired_medicines": expired_list
        }, status=status.HTTP_200_OK)


class InvoicePDFAPIView(APIView):
    """GET invoice PDF for a sale"""
    permission_classes = [IsAuthenticated, IsAdminOrPharmacist]

    def get(self, request, pk):
        """
        Generate and return PDF invoice for a specific sale.
        
        Query params:
        - format: 'pdf' (default) or 'html' for preview
        """
        from .utils import render_invoice_to_pdf, get_invoice_html_response
        
        sale = get_object_or_404(Sale, pk=pk)
        sale_items = SaleItem.objects.filter(sale=sale).select_related('medicine')
        
        format_type = request.query_params.get('format', 'pdf')
        
        company_info = {
            'name': 'Pharmacy Yanje',
            'address': '123 Pharmacy Street, 75001 Paris, France',
            'phone': '+33 1 23 45 67 89',
            'email': 'contact@pharmacy.com',
            'siret': '123 456 789 00012'
        }
        
        if format_type == 'html':
            return get_invoice_html_response(sale, sale_items, company_info)
        else:
            return render_invoice_to_pdf(sale, sale_items, company_info)

