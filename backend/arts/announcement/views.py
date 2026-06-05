from django.shortcuts import render
from rest_framework.permissions import AllowAny
from rest_framework import generics
from accounts.permissions import IsJudge,IsStudent
from rest_framework.response import Response
from rest_framework.views import APIView

from announcement.models import Announcement , ProgramSchedule
from announcement.serializers import AnnouncementSerializer , ProgramScheduleSerializer


# Create your views here.
class AnnouncementListCreateView(generics.ListCreateAPIView):
    queryset = Announcement.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = AnnouncementSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsJudge()]
        return [AllowAny()]


class AnnouncementDetailView(generics.RetrieveAPIView):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer
    permission_classes = [AllowAny]


class ProgramScheduleListView(generics.ListCreateAPIView):
    queryset = ProgramSchedule.objects.select_related('program')
    serializer_class = ProgramScheduleSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        date = self.request.query_params.get('date')
        stage = self.request.query_params.get('stage')
        event = self.request.query_params.get('event')
        
        if date:
            queryset = queryset.filter(start_at__date=date)
        if stage:
            queryset = queryset.filter(program__venue__icontains=stage)
        if event:
            if event.isdigit():
                queryset = queryset.filter(program__id=event)
            else:
                queryset = queryset.filter(program__name__icontains=event)
                
        return queryset

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsJudge()]
        return [AllowAny()]


class ProgramStageListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        stages = ProgramSchedule.objects.values_list('program__venue', flat=True).distinct()
        return Response(list(stages))


class ProgramEventListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        events = ProgramSchedule.objects.values_list('program__name', flat=True).distinct()
        return Response(list(events))


class ProgramDateListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        dates = ProgramSchedule.objects.dates('start_at', 'day')
        return Response([d.strftime('%Y-%m-%d') for d in dates])


class ProgramScheduleDetailView(generics.RetrieveUpdateAPIView):
    queryset = ProgramSchedule.objects.select_related('program')
    serializer_class = ProgramScheduleSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH']:
            return [IsJudge()]
        return [AllowAny()]