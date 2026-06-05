from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Department, Team, AcademicYear


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display   = ['username', 'email', 'role', 'department', 'is_approved', 'is_alumni', 'is_dropout']
    list_filter    = ['role', 'is_approved', 'is_alumni', 'is_dropout', 'department']
    search_fields  = ['username', 'email', 'first_name', 'last_name']
    ordering       = ['role', 'username']
    fieldsets = UserAdmin.fieldsets + (
        ('College Info', {
            'fields': (
                'role', 'is_approved', 'department', 'phone', 'profile_photo',
                'admission_year', 'expected_graduation_year', 'is_alumni', 'is_dropout',
            )
        }),
    )


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display  = ['name', 'code', 'is_active']
    search_fields = ['name', 'code']


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display      = ['name', 'academic_year', 'is_active']
    list_filter       = ['is_active', 'academic_year']
    filter_horizontal = ['departments']


@admin.register(AcademicYear)
class AcademicYearAdmin(admin.ModelAdmin):
    list_display  = ['year', 'name', 'start_date', 'end_date', 'is_active']
    list_filter   = ['is_active']
    ordering      = ['-year']
