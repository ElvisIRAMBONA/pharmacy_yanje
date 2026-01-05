from .models import ActivityLog

def log_activity(user, action_type, description, model_name=None, object_id=None, ip_address=None):
    """
    Log user activity in the system
    """
    ActivityLog.objects.create(
        user=user,
        action_type=action_type,
        model_name=model_name,
        object_id=object_id,
        description=description,
        ip_address=ip_address
    )

def get_client_ip(request):
    """
    Get client IP address from request
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip