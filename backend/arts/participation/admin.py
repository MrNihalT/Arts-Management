from django.contrib import admin
from .models import Participation


@admin.register(Participation)
class ParticipationAdmin(admin.ModelAdmin):
    list_display  = ['user', 'program', 'arts_fest', 'academic_year', 'is_winner', 'created_at']
    list_filter   = ['is_winner', 'arts_fest', 'program', 'academic_year']
    search_fields = ['user__username', 'user__first_name', 'user__last_name', 'program__name']
    ordering      = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
    filter_horizontal = ['team_members']

    fieldsets = (
        ('Registration', {
            'fields': ('user', 'program', 'arts_fest', 'academic_year')
        }),
        ('Team Members', {
            'fields': ('team_members',),
            'description': 'Only relevant for team-based programs.',
        }),
        ('Result', {
            'fields': ('is_winner',)
        }),
        ('Meta', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
