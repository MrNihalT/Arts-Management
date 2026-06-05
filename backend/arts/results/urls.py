from django.urls import path
from .views import ProgramResultView , TeamLeaderBoardView , PublishResultView

urlpatterns = [
    path('results/<int:program_id>/', ProgramResultView.as_view()),
    path('leaderboard/', TeamLeaderBoardView.as_view()),
    path('publish/<int:program_id>/', PublishResultView.as_view()),
]