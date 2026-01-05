from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import datetime, timedelta
from .models import ActivityLog
from .serializers import ActivityLogSerializer
from .permissions import IsAdminOrPharmacist

class ActivityLogAPIView(APIView):
    """GET activity logs with filtering"""
    permission_classes = [IsAuthenticated, IsAdminOrPharmacist]

    def get(self, request):
        # Get query parameters
        date_filter = request.query_params.get('date')
        user_filter = request.query_params.get('user')
        action_filter = request.query_params.get('action')
        limit = int(request.query_params.get('limit', 50))
        
        # Base queryset
        activities = ActivityLog.objects.select_related('user')
        
        # Apply filters
        if date_filter:
            try:
                filter_date = datetime.strptime(date_filter, '%Y-%m-%d').date()
                activities = activities.filter(timestamp__date=filter_date)
            except ValueError:
                pass
        
        if user_filter:
            activities = activities.filter(user__username__icontains=user_filter)
            
        if action_filter:
            activities = activities.filter(action_type=action_filter)
        
        # Limit results
        activities = activities[:limit]
        
        serializer = ActivityLogSerializer(activities, many=True)
        return Response(serializer.data)

class DailyActivitySummaryAPIView(APIView):
    """GET daily activity summary"""
    permission_classes = [IsAuthenticated, IsAdminOrPharmacist]

    def get(self, request):
        date_str = request.query_params.get('date', timezone.now().date().isoformat())
        
        try:
            report_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            report_date = timezone.now().date()
        
        # Get activities for the day
        start_of_day = timezone.make_aware(datetime.combine(report_date, datetime.min.time()))
        end_of_day = timezone.make_aware(datetime.combine(report_date, datetime.max.time()))
        
        activities = ActivityLog.objects.filter(
            timestamp__range=[start_of_day, end_of_day]
        ).select_related('user')
        
        # Summary statistics
        total_activities = activities.count()
        unique_users = activities.values('user').distinct().count()
        
        # Activity breakdown
        activity_breakdown = {}
        for activity in activities:
            action = activity.get_action_type_display()
            if action not in activity_breakdown:
                activity_breakdown[action] = 0
            activity_breakdown[action] += 1
        
        # User activity
        user_activities = {}
        for activity in activities:
            username = activity.user.username
            if username not in user_activities:
                user_activities[username] = 0
            user_activities[username] += 1
        
        # Recent activities (last 10)
        recent_activities = ActivityLogSerializer(activities[:10], many=True).data
        
        return Response({
            'date': report_date.isoformat(),
            'total_activities': total_activities,
            'unique_users': unique_users,
            'activity_breakdown': activity_breakdown,
            'user_activities': user_activities,
            'recent_activities': recent_activities
        })