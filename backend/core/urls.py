from django.contrib import admin
from django.urls import path, include
from django.views.generic.base import RedirectView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', RedirectView.as_view(url='/admin/', permanent=True)),

    # api/v1/*/
    path('api/v1/auth/', include('authenticate.urls')),
    path('api/v1/users/', include('user.urls')),
]
