from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q
from django.utils import timezone

from accounts.models import User
from accounts.permissions import IsAdmin, IsAdminOrPrincipal, IsStudent
from .models import ArtsProgram, ArtsFest
from participation.models import Participation
from .serializers import ArtsProgramSerializer, ArtsProgramListSerializer, ArtsFestSerializer


class ArtsProgramListCreateView(generics.ListCreateAPIView):
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ArtsProgramSerializer
        
        return ArtsProgramListSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminOrPrincipal()]

    def get_queryset(self):
        qs = ArtsProgram.objects.select_related('arts_fest').all()
        user = self.request.user

        # Filter by year
        year = self.request.query_params.get('year')
        if year:
            qs = qs.filter(arts_fest__year=year)

        search = self.request.query_params.get('search')

        if search:
            qs = qs.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search) |
                Q(venue__icontains=search) |
                Q(arts_fest__name__icontains=search)
            )
       
        # Team / Solo filter
        program_type = self.request.query_params.get('type')
        if program_type == "team":
            qs = qs.filter(is_team_based=True)
        elif program_type == "solo":
            qs = qs.filter(is_team_based=False)


        # Active filter
        active_param = self.request.query_params.get('active')
        if active_param is not None:
            qs = qs.filter(is_active=active_param.lower() == 'true')

        

        show_all = self.request.query_params.get('all', 'false').lower() == 'true'
        if not (show_all and user.role in ['admin', 'principal']):
            if active_param is None:
                qs = qs.filter(is_active=True)

        ordering = self.request.query_params.get('ordering')
        if ordering == "a-z":
            qs = qs.order_by('name')

        elif ordering == "z-a":
            qs = qs.order_by('-name')

        elif ordering == "newest":
            qs = qs.order_by('-created_at')

        elif ordering == "oldest":
            qs = qs.order_by('created_at')


        return qs

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ArtsProgramDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ArtsProgram.objects.select_related('arts_fest', 'created_by').all()
    serializer_class = ArtsProgramSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        if self.request.method == 'DELETE':
            return [IsAdmin()]
        return [IsAdminOrPrincipal()]


class ActiveProgramsView(generics.ListAPIView):
    serializer_class = ArtsProgramListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user = self.request.user

        if user.is_authenticated and (
            user.is_alumni or user.is_dropout
        ):
            return ArtsProgram.objects.none()

        active_fest = ArtsFest.objects.filter(
            is_active=True
        ).first()

        if not active_fest:
            return ArtsProgram.objects.none()

        qs = ArtsProgram.objects.filter(
            arts_fest=active_fest,
            is_active=True
        ).select_related('arts_fest')

        # SEARCH
        search = self.request.query_params.get('search')

        if search:
            qs = qs.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search) |
                Q(venue__icontains=search) |
                Q(arts_fest__name__icontains=search)
            ).distinct()

        # TEAM / SOLO
        program_type = self.request.query_params.get('type')

        if program_type == "group":
            qs = qs.filter(is_team_based=True)

        elif program_type == "solo":
            qs = qs.filter(is_team_based=False)

        # ORDERING
        ordering = self.request.query_params.get('ordering')

        if ordering == "a-z":
            qs = qs.order_by('name')

        elif ordering == "z-a":
            qs = qs.order_by('-name')

        elif ordering == "newest":
            qs = qs.order_by('-created_at')

        elif ordering == "oldest":
            qs = qs.order_by('created_at')

        return qs     


class ProgramsByYearView(generics.ListAPIView):
    serializer_class = ArtsProgramListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        year = self.kwargs['year']
        return ArtsProgram.objects.filter(
            arts_fest__year=year
        ).select_related('arts_fest')

class ArtsFestListView(generics.ListCreateAPIView):
    queryset = ArtsFest.objects.all()
    serializer_class = ArtsFestSerializer
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [IsAdminOrPrincipal()]

class RegisterForProgramView(APIView):
    permission_classes = [IsStudent]

    def _participation_count_for_fest(self, user, fest):
        return Participation.objects.filter(
            Q(user=user) | Q(team_members=user),
            program__arts_fest=fest
        ).distinct().count()

    def _program_participant_count(self, program):
        if not program.is_team_based:
            return program.participations.count()
        return sum(
            1 + participation.team_members.count()
            for participation in program.participations.prefetch_related('team_members')
        )

    def _validate_student_for_program(self, student, program, fest):
        if student.role != 'student' or not student.is_approved:
            return "Only approved students can participate."

        if student.is_alumni:
            return "Alumni cannot participate in current Arts Fest programs."

        if student.is_dropout:
            return "Dropout students cannot participate in Arts Fest programs."

        if program.eligible_batches.exists():
            if not program.eligible_batches.filter(id=student.admission_year_id).exists():
                return "This student's batch is not eligible for this program."

        if self._participation_count_for_fest(student, fest) >= fest.max_programs_per_student:
            return f"{student.username} has reached the limit of {fest.max_programs_per_student} programs for {fest.name}."

        if Participation.objects.filter(
            Q(user=student) | Q(team_members=student),
            program=program
        ).exists():
            return f"{student.username} is already registered for this program."

        return None

    def post(self, request, pk):
        try:
            program = ArtsProgram.objects.get(pk=pk)
        except ArtsProgram.DoesNotExist:
            return Response({"detail": "Program not found."}, status=status.HTTP_404_NOT_FOUND)

        student = request.user
        fest = program.arts_fest

        if not fest:
            return Response({"detail": "Program is not assigned to an Arts Fest."}, status=status.HTTP_400_BAD_REQUEST)

        if not fest.is_active or not program.is_active:
            return Response({"detail": "Registration is closed for this program."}, status=status.HTTP_403_FORBIDDEN)

        if program.last_date < timezone.localdate():
            return Response({"detail": "Registration deadline has passed."}, status=status.HTTP_403_FORBIDDEN)

        leader_error = self._validate_student_for_program(student, program, fest)
        if leader_error:
            return Response({"detail": leader_error}, status=status.HTTP_403_FORBIDDEN)

        team_member_ids = request.data.get('team_member_ids', [])
        if team_member_ids is None:
            team_member_ids = []
        if not isinstance(team_member_ids, list):
            return Response({
                "detail": "team_member_ids must be a list of student IDs."
            }, status=status.HTTP_400_BAD_REQUEST)

        team_member_ids = list(dict.fromkeys(team_member_ids))
        if student.id in team_member_ids:
            return Response({"detail": "Do not include yourself in team_member_ids."}, status=status.HTTP_400_BAD_REQUEST)

        if program.is_team_based:
            if not team_member_ids:
                return Response({"detail": "Team-based programs require at least one team member."}, status=status.HTTP_400_BAD_REQUEST)

            team_size = 1 + len(team_member_ids)
            if program.max_team_members and team_size > program.max_team_members:
                return Response({
                    "detail": f"Team size cannot exceed {program.max_team_members} members."
                }, status=status.HTTP_400_BAD_REQUEST)
        elif team_member_ids:
            return Response({"detail": "Solo programs cannot include team members."}, status=status.HTTP_400_BAD_REQUEST)

        team_members = list(User.objects.filter(id__in=team_member_ids))
        if len(team_members) != len(team_member_ids):
            return Response({"detail": "One or more team members were not found."}, status=status.HTTP_400_BAD_REQUEST)

        for member in team_members:
            member_error = self._validate_student_for_program(member, program, fest)
            if member_error:
                return Response({"detail": member_error}, status=status.HTTP_403_FORBIDDEN)

        if program.max_participants is not None:
            new_slots = 1 + len(team_members)
            if self._program_participant_count(program) + new_slots > program.max_participants:
                return Response({"detail": "Program participation is full."}, status=status.HTTP_400_BAD_REQUEST)

        participation = Participation.objects.create(
            user=student, 
            program=program,
            arts_fest=fest,
            academic_year=student.admission_year
        )
        if team_members:
            participation.team_members.set(team_members)

        return Response({"detail": "Successfully registered."}, status=status.HTTP_201_CREATED)
