from unittest import result
from django.core.cache import cache
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response 
from rest_framework import generics
from results.models import Result, ResultPosition
from scores.models import Score
from accounts.models import Team, AcademicYear, Department
from results.serializers import ResultSerializer, ResultPositionSerializer
from results.services import calculate_program_result
from accounts.permissions import IsJudge
# Create your views here.


class ProgramResultView(APIView):
    permission_classes = [AllowAny]

    def get(self,request,program_id):
        result = Result.objects.filter(
            program_id=program_id,
            published=True
        ).first()
        if not result:
            return Response({"message": "Result not published"}, status=404)
        
        top3 = result.positions.select_related(
            'participation__user__department',
            'participation__program',
            'team'
        ).order_by('position')

        if not top3.exists() and Score.objects.filter(participation__program_id=program_id).exists():
            calculate_program_result(result)
            top3 = result.positions.select_related(
                'participation__user__department',
                'participation__program',
                'team'
            ).order_by('position')
        
        all_scores = Score.objects.select_related(
            'participation__user',
            'participation__program',
        ).filter(
            participation__program_id=program_id
        ).order_by('-obtained_score')

        return Response({
            "top3": ResultPositionSerializer(top3, many=True).data,
            "results": ResultSerializer(all_scores, many=True).data
        })


class TeamLeaderBoardView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        year_id = request.query_params.get('academic_year')
        if year_id:
            active_year = AcademicYear.objects.filter(id=year_id).first()
        else:
            active_year = AcademicYear.objects.filter(is_active=True).order_by('-year').first()
            year_id = active_year.id if active_year else None
        
        cache_key = f"leaderboard_year_{year_id}"

        cached_data = cache.get(cache_key)
        if cached_data:
            print("this is from chaceh")
            return Response(cached_data)
        
        if not active_year:
            return Response({
                "error": "No active academic year found"
            }, status=status.HTTP_404_NOT_FOUND)

        # Initialize teams stats
        teams = Team.objects.filter(is_active=True, academic_year=active_year)
        team_stats = {}
        for team in teams:
            team_stats[team.id] = {
                "id": team.id,
                "name": team.name,
                "total_points": 0,
                "first_places": 0,
                "second_places": 0,
                "third_places": 0
            }

        # Initialize departments stats
        departments = Department.objects.filter(is_active=True)
        dept_stats = {}
        for dept in departments:
            dept_stats[dept.id] = {
                "id": dept.id,
                "name": dept.name,
                "code": dept.code,
                "total_points": 0,
                "first_places": 0,
                "second_places": 0,
                "third_places": 0
            }

        # Get positions of published results that occurred in the selected academic year
        positions = ResultPosition.objects.filter(
            result__published=True,
            participation__academic_year=active_year
        ).select_related('team', 'participation__user__department')

        for pos in positions:
            # Update team stats
            if pos.team and pos.team.id in team_stats:
                team_stats[pos.team.id]["total_points"] += pos.points
                if pos.position == 1:
                    team_stats[pos.team.id]["first_places"] += 1
                elif pos.position == 2:
                    team_stats[pos.team.id]["second_places"] += 1
                elif pos.position == 3:
                    team_stats[pos.team.id]["third_places"] += 1

            # Update department stats
            user_dept = pos.participation.user.department
            if user_dept and user_dept.id in dept_stats:
                dept_stats[user_dept.id]["total_points"] += pos.points
                if pos.position == 1:
                    dept_stats[user_dept.id]["first_places"] += 1
                elif pos.position == 2:
                    dept_stats[user_dept.id]["second_places"] += 1
                elif pos.position == 3:
                    dept_stats[user_dept.id]["third_places"] += 1

        team_leaderboard = list(team_stats.values())
        team_leaderboard.sort(key=lambda x: x["total_points"], reverse=True)
        for rank, entry in enumerate(team_leaderboard, start=1):
            entry["rank"] = rank

        dept_leaderboard = list(dept_stats.values())
        dept_leaderboard.sort(key=lambda x: x["total_points"], reverse=True)
        for rank, entry in enumerate(dept_leaderboard, start=1):
            entry["rank"] = rank

        response_data = {
            "academic_year": {
                "id": active_year.id,
                "name": active_year.name,
                "year": active_year.year
            },
            "teams": team_leaderboard,
            "departments": dept_leaderboard
        }

        # Store calculated leaderboard in Redis cache for 1 hour (3600 seconds)
        cache.set(cache_key, response_data, timeout=3600)

        return Response(response_data)


        
class PublishResultView(APIView):
    permission_classes = [IsJudge]
    
    def post(self, request, program_id):
        result, created = Result.objects.get_or_create(
            program_id=program_id
        )

        result.published = True
        result.save()

        calculate_program_result(result)

        # Invalidate cached leaderboards so they are updated on the next load
        if hasattr(cache, 'delete_pattern'):
            cache.delete_pattern("leaderboard_year_*")
        else:
            cache.clear()

        return Response({
            "message": "Result published and calculated successfully"
        }, status=status.HTTP_200_OK)