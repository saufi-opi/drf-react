from django.urls import path
from .views import UserViewSet, UserChangePasswordView

urlpatterns = [
    path('', UserViewSet.as_view({'get': 'list'}), name='user-list-create'),
    path('change-password/', UserChangePasswordView.as_view(), name='user-change-password'),
    path('<int:pk>/', UserViewSet.as_view({'get': 'retrieve', 'put': 'update'}), name='user-detail'),
]
