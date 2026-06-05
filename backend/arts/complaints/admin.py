from django.contrib import admin

from .models import Complaint


@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'email', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['title', 'user', 'email', 'message']
    readonly_fields = ['created_at', 'updated_at']
