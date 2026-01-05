from django.urls import path
from .views import MedicineListCreateAPIView, MedicineDetailAPIView, ExpiredMedicinesAPIView

urlpatterns = [
    path('', MedicineListCreateAPIView.as_view(), name='medicine_list_create'),
    path('<int:pk>/', MedicineDetailAPIView.as_view(), name='medicine_detail'),
    path('expired/', ExpiredMedicinesAPIView.as_view(), name='medicine_expired'),
]
