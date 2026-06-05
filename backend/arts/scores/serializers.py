from rest_framework import serializers
from scores.models import Score


class ScoreReadSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='participation.user.username', read_only=True)
    program_name = serializers.CharField(source='participation.program.name', read_only=True)
    program_id = serializers.IntegerField(source='participation.program.id', read_only=True)
    department_name = serializers.SerializerMethodField()
    judge_name = serializers.CharField(source='judge.username', read_only=True)
    participation_id = serializers.IntegerField(source='participation.id', read_only=True)

    class Meta:
        model = Score
        fields = [
            'id',
            'participation_id',
            'user_name',
            'program_name',
            'program_id',
            'department_name',
            'obtained_score',
            'judge',
            'judge_name'
        ]

    def get_department_name(self, obj):
        user = obj.participation.user
        if user and user.department:
            return user.department.name
        return "-"


class ScoreUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        fields = ['obtained_score']

class ScoreCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        fields = ['participation', 'obtained_score']