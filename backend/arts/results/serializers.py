from rest_framework import serializers
from results.models import Result , ResultPosition
from scores.models import Score


class ResultSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='participation.user.username', read_only=True)
    program_name = serializers.CharField(source='participation.program.name', read_only=True)


    class Meta:
        model = Score
        fields = ['user_name', 'program_name', 'obtained_score']


class ResultPositionSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(
        source='participation.user.username',
        read_only=True
    )
    program_name = serializers.CharField(
        source='participation.program.name',
        read_only=True
    )
    department = serializers.CharField(
        source='participation.user.department.name',
        read_only=True
    )
    team_name = serializers.CharField(
        source='team.name',
        read_only=True
    )

    class Meta:
        model = ResultPosition
        fields = [
            'position',
            'user_name',
            'program_name',
            'department',
            'team_name',
            'score',
            'points'
        ]