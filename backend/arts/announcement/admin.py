from django.contrib import admin
from announcement.models import Announcement , ProgramSchedule

# Register your models here.
@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ('title','link', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('title', 'message')
    ordering = ('-created_at',)

@admin.register(ProgramSchedule)
class ProgramScheduleAdmin(admin.ModelAdmin):
    list_display = ('program','message','start_at','created_at','updated_at')
    list_filter = ('program','start_at')
    search_fields = ('program__name', 'message')
    ordering = ('-start_at',)
