from rest_framework import serializers
from .models import ArtsProgram, ArtsFest
from accounts.models import AcademicYear

class AcademicYearBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicYear
        fields = ['id', 'year', 'name']

class ArtsFestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtsFest
        fields = '__all__'

class ArtsProgramSerializer(serializers.ModelSerializer):
    arts_fest_detail = ArtsFestSerializer(source='arts_fest', read_only=True)
    created_by_name = serializers.SerializerMethodField()
    is_published = serializers.SerializerMethodField()
    registration_count = serializers.SerializerMethodField()

    class Meta:
        model = ArtsProgram
        fields = [
            'id', 'name', 'arts_fest', 'arts_fest_detail',
            'eligible_batches','event_image',
            'description', 'venue', 'max_participants', 'rules',
            'is_active', 'is_graduate_restricted', 'last_date',
            'is_team_based', 'max_team_members',
            'created_by', 'created_by_name',
            'created_at', 'updated_at', 'is_published', 'registration_count'
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at']

    def get_created_by_name(self, obj):
        if obj.created_by:
            return f"{obj.created_by.first_name} {obj.created_by.last_name}".strip() or obj.created_by.username
        return None

    def get_is_published(self, obj):
        return hasattr(obj, 'result') and obj.result.published

    def get_registration_count(self, obj):
        return obj.participations.count()

    def validate(self, data):
        is_team_based = data.get('is_team_based', getattr(self.instance, 'is_team_based', False))
        max_team_members = data.get('max_team_members', getattr(self.instance, 'max_team_members', None))

        if is_team_based and not max_team_members:
            raise serializers.ValidationError({
                'max_team_members': 'Max members per team is required for team-based programs.'
            })

        # If not team-based, clear the team-specific field
        if not is_team_based:
            data['max_team_members'] = None

        return data


class ArtsProgramListSerializer(serializers.ModelSerializer):
    year = serializers.IntegerField(source='arts_fest.year', read_only=True)
    arts_fest_name = serializers.CharField(source='arts_fest.name', read_only=True)
    is_registered = serializers.SerializerMethodField()
    top_scores = serializers.SerializerMethodField()
    eligible_batches = AcademicYearBasicSerializer(many=True, read_only=True)
    is_published = serializers.SerializerMethodField()
    registration_count = serializers.SerializerMethodField()
    class Meta:
        model = ArtsProgram
        fields = [
            'id', 'name', 'year', 'arts_fest_name', 'arts_fest',
            'eligible_batches', 'is_registered', 'event_image', 'description',
            'venue', 'max_participants', 'last_date',
            'is_active', 'is_graduate_restricted',
            'is_team_based', 'max_team_members','top_scores',
            'is_published', 'registration_count',
        ]

    def get_is_registered(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.participations.filter(user=request.user).exists()
        return False
    
    def get_top_scores(self, obj):
        scores = obj.top_scores.select_related('participation__user')
        return [
            {
                "user":score.participation.user.username,
                "score":score.obtained_score
            }
            for score in scores
        ]

    def get_is_published(self, obj):
        return hasattr(obj, 'result') and obj.result.published

    def get_registration_count(self, obj):
        return obj.participations.count()
