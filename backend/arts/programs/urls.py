from django.urls import path
from programs import views

urlpatterns = [
    path('', views.ArtsProgramListCreateView.as_view(), name='program_list_create'),
    path('active/', views.ActiveProgramsView.as_view(), name='active_programs'),
    path('fests/', views.ArtsFestListView.as_view(), name='fests_list'),
    path('year/<int:year>/', views.ProgramsByYearView.as_view(), name='programs_by_year'),
    path('<int:pk>/', views.ArtsProgramDetailView.as_view(), name='program_detail'),
    path('<int:pk>/register/', views.RegisterForProgramView.as_view(), name='program_register'),
]