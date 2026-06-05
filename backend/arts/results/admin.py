from django.contrib import admin
from results.models import Result , ResultPosition
# Register your models here.


@admin.register(Result)
class ResultAdmin(admin.ModelAdmin):
    list_display = ['program', 'published', 'created_at']
    list_filter = ['published']
    search_fields = ['program__name']
    readonly_fields = ['created_at']


@admin.register(ResultPosition)
class ResultPositionAdmin(admin.ModelAdmin):
    list_display = ['result', 'participation', 'team', 'position', 'points', 'score']
    list_filter = ['result', 'position']
    search_fields = ['result__program__name', 'participation__user__name', 'team__name']