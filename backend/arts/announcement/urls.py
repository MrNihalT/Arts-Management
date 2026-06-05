from django.urls import path
from announcement.views import (
    AnnouncementDetailView,
    AnnouncementListCreateView,
    ProgramScheduleDetailView,
    ProgramScheduleListView,
    ProgramDateListView,
    ProgramEventListView,
    ProgramStageListView
)

urlpatterns = [
    path('', AnnouncementListCreateView.as_view()),
    path('<int:pk>/', AnnouncementDetailView.as_view()),
    path('schedule/', ProgramScheduleListView.as_view()),
    path('schedule/<int:pk>/', ProgramScheduleDetailView.as_view()),
    path('schedule/stage/', ProgramStageListView.as_view()),
    path('schedule/event/', ProgramEventListView.as_view()),
    path('schedule/date/', ProgramDateListView.as_view()),
]