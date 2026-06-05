from rest_framework import generics
from rest_framework.permissions import AllowAny
from scores.models import Score
from scores.serializers import ScoreReadSerializer, ScoreUpdateSerializer, ScoreCreateSerializer
from accounts.permissions import IsJudge


class ScoreListCreateView(generics.ListCreateAPIView):

    def get_queryset(self):
        queryset = Score.objects.select_related(
            'participation__user',
            'participation__program',
            'participation__user__department',
            'judge'
        )
        program_id = self.request.query_params.get('program')
        if program_id:
            queryset = queryset.filter(participation__program_id=program_id)
        return queryset

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsJudge()]   
        return [AllowAny()]     

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ScoreCreateSerializer
        return ScoreReadSerializer

    def perform_create(self, serializer):
        serializer.save(judge=self.request.user)  


class ScoreDetailView(generics.RetrieveUpdateAPIView):

    queryset = Score.objects.select_related(
        'participation__user',
        'participation__program',
        'participation__user__department',
        'judge'
    )

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH']:
            return [IsJudge()]   
        return [AllowAny()]     

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ScoreUpdateSerializer
        return ScoreReadSerializer