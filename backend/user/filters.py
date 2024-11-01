from django_filters import rest_framework as filters
from .models import User
from django.db.models import Q

class UserFilter(filters.FilterSet):
    group_id = filters.NumberFilter(field_name='groups__id', lookup_expr='exact')
    group_name = filters.CharFilter(field_name='groups__name', lookup_expr='exact')
    search = filters.CharFilter(method='perform_search')

    class Meta:
        model = User
        fields = ['group_id']
    
    def perform_search(self, queryset, name, value):
        return queryset.filter(
            Q(email__icontains=value) |
            Q(username__icontains=value)
        )
