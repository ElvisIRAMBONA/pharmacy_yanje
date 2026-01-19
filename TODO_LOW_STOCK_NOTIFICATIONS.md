# Todo: Low Stock Notification System

## Task: Notify admin when stock gets low

### Files to Create:
1. `apps/notifications/__init__.py` - New notifications app
2. `apps/notifications/models.py` - Notification model
3. `apps/notifications/admin.py` - Admin registration
4. `apps/notifications/serializers.py` - Serializers
5. `apps/notifications/urls.py` - URL routing
6. `apps/notifications/views.py` - API views

### Files to Modify:
1. `apps/sales/views.py` - Check stock after sale and create notifications
2. `apps/inventory/signals.py` - Signal handler for low stock
3. `frontend/src/services/api.js` - Add notification API endpoints
4. `frontend/src/components/Navigation.js` - Add notification bell
5. `frontend/src/App.css` - Add notification styles

### Features:
1. Auto-create notification when stock falls below reorder level
2. Mark notifications as read when viewed
3. Notification badge in navbar
4. Low stock alerts on admin dashboard
5. Notification count stored in localStorage
