from django.urls import path
from rest_framework_simplejwt.views import TokenVerifyView
from .views import LoginView, RefreshView, LogoutView, UserProfileView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login' ),
    path('verify/', TokenVerifyView.as_view(), name='verify' ),
    path('refresh/', RefreshView.as_view(), name='refresh' ),
    path('logout/', LogoutView.as_view(), name='logout' ),
    path('me/', UserProfileView.as_view(), name='me' ),
]