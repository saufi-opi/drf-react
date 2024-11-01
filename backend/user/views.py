from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import BasePermission
from .models import User
from .serializers import UserSerializer, ChangePasswordSerializer
from .filters import UserFilter


class IsOwnerOrStaff(BasePermission):
    """
    Custom permission to only allow owners of an object or staff/superusers to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any authenticated request
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return request.user.is_authenticated
        
        # Write permissions are only allowed to the owner, staff, or superusers
        return (
            obj == request.user or 
            request.user.is_staff or 
            request.user.is_superuser
        )
    

class  UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filterset_class = UserFilter
    permission_classes = [IsOwnerOrStaff]


class UserChangePasswordView(APIView):
    serializer_class = ChangePasswordSerializer

    def put(self, request):
        user = request.user
        serializer = self.serializer_class(data=request.data)
        
        if serializer.is_valid():
            # Check if old password is correct
            if not user.check_password(serializer.data.get('old_password')):
                return Response(
                    {'errors': {'old_password': ['Wrong password']}},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Set new password
            user.set_password(serializer.data.get('new_password'))
            user.save()
            
            return Response(
                {'detail': 'Password successfully changed'},
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
