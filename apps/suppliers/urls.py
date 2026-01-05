from django.urls import path
from . import views

urlpatterns = [
    # Suppliers (remove 'suppliers/' prefix to avoid duplicate path)
    path('', views.SupplierListCreateAPIView.as_view(), name='supplier_list_create'),
    path('<int:pk>/', views.SupplierDetailAPIView.as_view(), name='supplier_detail'),
    
    # Purchase Orders
    path('purchase-orders/', views.PurchaseOrderListCreateAPIView.as_view(), name='purchase_order_list_create'),
    path('purchase-orders/<int:pk>/', views.PurchaseOrderDetailAPIView.as_view(), name='purchase_order_detail'),
]

