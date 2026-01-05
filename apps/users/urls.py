from django.urls import path
from . import views
from .activity_views import ActivityLogAPIView, DailyActivitySummaryAPIView

urlpatterns = [
    path('users/', views.UserListCreateAPIView.as_view(), name='user_list_create'),
    path('users/<int:pk>/', views.UserDetailAPIView.as_view(), name='user_detail'),
    path('login/', views.LoginAPIView.as_view(), name='login'),
    path('token/refresh/', views.TokenRefreshAPIView.as_view(), name='token_refresh'),
    path('users/change-password/', views.ChangePasswordAPIView.as_view(), name='change_password'),
    path('activity-logs/', ActivityLogAPIView.as_view(), name='activity_logs'),
    path('daily-summary/', DailyActivitySummaryAPIView.as_view(), name='daily_summary'),
]
