from rest_framework import serializers
from .models import Participation
from accounts.models import Team


class TeamMemberSerializer(serializers.Serializer):
    username = serializers.CharField()
    department = serializers.CharField(source="department.name", default=None)


class ParticipationSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.username")
    department = serializers.CharField(source="user.department.name", read_only=True)
    team = serializers.SerializerMethodField()
    team_members = serializers.SerializerMethodField()

    def get_team(self, obj):
        team = Team.objects.filter(departments=obj.user.department).first()
        return team.name if team else None

    def get_team_members(self, obj):
        members = obj.team_members.select_related("department").all()
        
        return TeamMemberSerializer(members, many=True).data

    program = serializers.CharField(source="program.name", read_only=True)
    arts_fest = serializers.CharField(source="arts_fest.name", read_only=True)
    academic_year = serializers.CharField(source="academic_year.year", read_only=True)

    class Meta:
        model = Participation
        fields = [
            "id",
            "user",
            "program",
            "arts_fest",
            "academic_year",
            "team_members",
            "department",
            "team",
            "created_at",
        ]