from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from user.serializers import UserSerializer
from rest_framework import serializers

# TODO: login using email
class LoginSerializer(TokenObtainPairSerializer):
    """
    Custom serializer for login.
    """

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user

        if not (user.groups.exists() or user.is_superuser):
            raise serializers.ValidationError({
                "detail": "Access denied. User must be assigned to a group."
            })
        
        # Use UserSerializer to serialize user details
        user_serializer = UserSerializer(user)
        data['user'] = user_serializer.data

        return data
