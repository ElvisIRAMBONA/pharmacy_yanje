from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Custom permission class to allow only admin users to access.
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'admin'
        )

class IsPharmacist(permissions.BasePermission):
    """
    Custom permission class to allow only pharmacist users to access.
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'pharmacist'
        )

class IsAdminOrPharmacist(permissions.BasePermission):
    """
    Custom permission class to allow both admin and pharmacist users to access.
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['admin', 'pharmacist']
        )

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission class that allows read access to any authenticated user,
    but write access only to admin users.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return request.user.role == 'admin'

