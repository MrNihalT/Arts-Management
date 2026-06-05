from rest_framework import serializers
from announcement.models import Announcement , ProgramSchedule


class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = '__all__'


class ProgramScheduleSerializer(serializers.ModelSerializer):
    program_name = serializers.CharField(source='program.name',read_only=True)
    venue = serializers.CharField(source='program.venue',read_only=True)
    class Meta:
        model = ProgramSchedule
        fields = ['id','program','program_name','venue','message','start_at']
