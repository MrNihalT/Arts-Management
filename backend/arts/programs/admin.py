from django.contrib import admin
from .models import ArtsProgram, ArtsFest


@admin.register(ArtsFest)
class ArtsFestAdmin(admin.ModelAdmin):
    list_display    = ['name', 'year', 'max_programs_per_student', 'start_date', 'end_date', 'is_active', 'created_by']
    list_filter     = ['is_active', 'year']
    search_fields   = ['name']
    ordering        = ['-year']
    readonly_fields = ['created_by', 'created_at', 'updated_at']

    fieldsets = (
        ('Festival Info', {
            'fields': ('name', 'year', 'max_programs_per_student', 'start_date', 'end_date', 'is_active')
        }),
        ('Meta', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ArtsProgram)
class ArtsProgramAdmin(admin.ModelAdmin):
    list_display    = [
        'name', 'arts_fest', 'venue', 'is_team_based',
        'max_participants', 'max_team_members', 'last_date',
        'is_active', 'is_graduate_restricted', 'created_by', 'created_at',
    ]
    list_filter     = ['is_active', 'is_graduate_restricted', 'is_team_based', 'arts_fest']
    search_fields   = ['name', 'venue']
    ordering        = ['-arts_fest__year', 'name']
    readonly_fields = ['created_by', 'created_at', 'updated_at']
    filter_horizontal = ['eligible_batches']

    fieldsets = (
        ('Basic Info', {
            'fields': ('name', 'arts_fest', 'description', 'venue', 'rules', 'event_image', 'last_date')
        }),
        ('Participation Settings', {
            'fields': ('eligible_batches', 'max_participants', 'is_graduate_restricted')
        }),
        ('Team Settings', {
            'fields': ('is_team_based', 'max_team_members'),
            'description': 'Only relevant when this is a team-based program.',
        }),
        ('Visibility', {
            'fields': ('is_active',)
        }),
        ('Meta', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
