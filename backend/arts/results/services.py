from django.db import transaction
from scores.models import Score
from results.models import ResultPosition
from accounts.models import AcademicYear


POINTS = {
    1: 5,
    2: 3,
    3: 1,
}

@transaction.atomic
def calculate_program_result(result):
    program = result.program
    if not program:
        raise ValueError("Result must be associated with a program.")
    
    ResultPosition.objects.filter(result=result).delete()
    scores = Score.objects.filter(
        participation__program=program,
    ).select_related('participation__user__department').order_by('-obtained_score', '-created_at')[:3]

    for index, score_obj in enumerate(scores,start=1):
        user = score_obj.participation.user
        team = None

        participation_year = score_obj.participation.academic_year or AcademicYear.objects.filter(is_active=True).order_by('-year').first()
        if user.department and participation_year:
            team = user.department.teams.filter(
                is_active=True,
                academic_year=participation_year
            ).first()
        
        ResultPosition.objects.create(
            result=result,
            participation=score_obj.participation,
            team=team,
            position=index,
            points=POINTS[index],
            score=score_obj.obtained_score
        )