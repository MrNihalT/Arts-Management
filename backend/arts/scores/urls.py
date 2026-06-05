from django.urls import path
from scores import views

urlpatterns = [
    path('', views.ScoreListCreateView.as_view()),      # GET list + POST create
    path('<int:pk>/', views.ScoreDetailView.as_view()), # GET one + PATCH update
]