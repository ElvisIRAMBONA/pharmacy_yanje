from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    time_ago = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            'id', 'notification_type', 'title', 'message',
            'priority', 'is_read', 'related_object_id',
            'created_at', 'time_ago'
        ]

    def get_time_ago(self, obj):
        from django.utils.timesince import timesince
        from django.utils import timezone
        return timesince(obj.created_at, timezone.now())

