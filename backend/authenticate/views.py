from .serializers import LoginSerializer
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView
from django.utils import timezone
from rest_framework.response import Response
from user.serializers import UserSerializer
from django.conf import settings

class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == status.HTTP_200_OK:
            refresh_token_lifetime = settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME']
            # Set the refresh token as HttpOnly cookie
            response.set_cookie(
                'refresh_token', 
                response.data['refresh'], 
                httponly=True, secure=True, 
                samesite='Lax', 
                max_age=int(refresh_token_lifetime.total_seconds())
            )
            
            # Optionally, remove the refresh token from the response body
            response.data.pop('refresh')
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.user

            # Update the last_login field
            user.last_login = timezone.now()
            user.save(update_fields=['last_login'])

        return response

class RefreshView(TokenRefreshView):
    
    def post(self, request, *args, **kwargs):
        # Extract the refresh token from the cookie
        refresh_token = request.COOKIES.get('refresh_token')

        if not refresh_token:
            return Response({"detail": "Refresh token missing."}, status=status.HTTP_400_BAD_REQUEST)

        # Modify the request data to include the refresh token
        request.data['refresh'] = refresh_token
        
        # Proceed with the usual refresh logic
        response = super().post(request, *args, **kwargs)      
        return response
    
class LogoutView(TokenBlacklistView):

    def post(self, request, *args, **kwargs):
        # Extract the refresh token from the cookie
        refresh_token = request.COOKIES.get('refresh_token')

        if not refresh_token:
            return Response({"detail": "Refresh token missing."}, status=status.HTTP_400_BAD_REQUEST)

        # Add the refresh token to the request data
        request.data['refresh'] = refresh_token

        # Call the parent method to blacklist the token
        response = super().post(request, *args, **kwargs)

        if response.status_code == status.HTTP_200_OK:
            # Delete the refresh token cookie after blacklisting
            response.delete_cookie('refresh_token')
            response.data = {"detail": "Successfully logged out."}

        return response

class UserProfileView(APIView):
    def get(self, request, *args, **kwargs):
        # Get the authenticated user
        user = request.user
        
        # Serialize the user data
        serializer = UserSerializer(user)
        
        return Response(serializer.data, status=status.HTTP_200_OK)