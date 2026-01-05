from django.urls import path
from . import views

urlpatterns = [
    # Inventory
    path('', views.InventoryListCreateAPIView.as_view(), name='inventory_list_create'),
    path('<int:pk>/', views.InventoryDetailAPIView.as_view(), name='inventory_detail'),
    
    # Alerts & Stats
    path('alerts/low-stock/', views.LowStockAlertAPIView.as_view(), name='low_stock_alert'),
    path('stats/', views.InventoryStatsAPIView.as_view(), name='inventory_stats'),
]

