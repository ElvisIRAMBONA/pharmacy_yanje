from django.urls import path
from . import views

urlpatterns = [
    # Sales
    path('', views.SaleListCreateAPIView.as_view(), name='sale_list_create'),
    path('<int:pk>/', views.SaleDetailAPIView.as_view(), name='sale_detail'),
    
    # Invoice PDF
    path('<int:pk>/invoice/', views.InvoicePDFAPIView.as_view(), name='sale_invoice'),
    
    # Reports
    path('reports/daily/', views.DailySalesReportAPIView.as_view(), name='daily_sales_report'),
    path('reports/monthly/', views.MonthlySalesReportAPIView.as_view(), name='monthly_sales_report'),
    path('reports/expired-medicines/', views.ExpiredMedicinesAPIView.as_view(), name='expired_medicines'),
]

