from django.contrib import admin
from .models import Score
# Register your models here.


@admin.register(Score)
class ScoreAdmin(admin.ModelAdmin):
    list_display = ['id','get_user', 'get_program', 'obtained_score', 'judge','get_department']
    list_filter = ['judge']
    search_fields = ['participation__user__username', 'participation__program__name']

    def get_department(self, obj):
        user = obj.participation.user
        if user and user.department:
            return user.department.name
        return "-"
    
    def get_user(self, obj):
        return obj.participation.user.username
    get_user.short_description = 'User'

    def get_program(self, obj):
        return obj.participation.program.name
    get_program.short_description = 'Program'