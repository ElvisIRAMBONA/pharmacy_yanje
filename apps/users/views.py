from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from .models import CustomUser
from .serializers import CustomUserSerializer, LoginSerializer
from .permissions import IsAdmin


class UserListCreateAPIView(APIView):
    """GET all users | POST new user (registration)"""
    
    def get_permissions(self):
        """GET requires authentication, POST (registration) allows anyone"""
        if self.request.method == 'POST':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get(self, request):
        """Only admin can list all users"""
        if not request.user.is_admin:
            return Response(
                {"error": "Only admin can access user list"},
                status=status.HTTP_403_FORBIDDEN
            )
        users = CustomUser.objects.all()
        serializer = CustomUserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """Registration - allow anyone to create user, but validate role"""
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetailAPIView(APIView):
    """GET, PUT, DELETE for a single user"""
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """Get user details - user can see own details, admin can see all"""
        if not request.user.is_admin and request.user.pk != pk:
            return Response(
                {"error": "You can only view your own profile"},
                status=status.HTTP_403_FORBIDDEN
            )
        user = get_object_or_404(CustomUser, pk=pk)
        serializer = CustomUserSerializer(user)
        return Response(serializer.data)

    def put(self, request, pk):
        """Update user - user can update own profile, admin can update all"""
        if not request.user.is_admin and request.user.pk != pk:
            return Response(
                {"error": "You can only update your own profile"},
                status=status.HTTP_403_FORBIDDEN
            )
        user = get_object_or_404(CustomUser, pk=pk)
        
        # Non-admin users cannot change their role
        if not request.user.is_admin and 'role' in request.data:
            del request.data['role']
        
        serializer = CustomUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """Delete user - only admin can delete users"""
        if not request.user.is_admin:
            return Response(
                {"error": "Only admin can delete users"},
                status=status.HTTP_403_FORBIDDEN
            )
        user = get_object_or_404(CustomUser, pk=pk)
        user.delete()
        return Response({"message": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


class LoginAPIView(APIView):
    """POST - User login"""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            user = authenticate(request, username=username, password=password)
            
            if user is not None:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'message': 'Login successful',
                    'user': CustomUserSerializer(user).data,
                    'access_token': str(refresh.access_token),
                    'refresh_token': str(refresh),
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Invalid credentials'
                }, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TokenRefreshAPIView(APIView):
    """POST - Refresh access token"""
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.data.get('refresh_token')
        if not refresh_token:
            return Response(
                {'error': 'Refresh token is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            return Response({
                'access_token': access_token
            }, status=status.HTTP_200_OK)
        except (InvalidToken, TokenError):
            return Response(
                {'error': 'Invalid refresh token'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )


class ChangePasswordAPIView(APIView):
    """POST - Change user password"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        
        if not current_password or not new_password:
            return Response(
                {'error': 'Both current and new passwords are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verify current password
        if not request.user.check_password(current_password):
            return Response(
                {'error': 'Current password is incorrect'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate new password length
        if len(new_password) < 8:
            return Response(
                {'error': 'New password must be at least 8 characters long'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Set new password
        request.user.set_password(new_password)
        request.user.save()
        
        return Response(
            {'message': 'Password changed successfully'}, 
            status=status.HTTP_200_OK
        )
