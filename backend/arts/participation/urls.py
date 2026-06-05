from django.urls import path
from participation import views
urlpatterns = [
    path('list/', views.ParticipationListView.as_view(), name='participation_list'),
    path('<int:pk>/', views.ParticipationDetailView.as_view(), name='participation_detail'),
    path('program/<int:pk>/', views.ParticipationByProgramView.as_view(), name='participation_by_program'),
]
