from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework.throttling import AnonRateThrottle
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema

from accounts.models import User , Department , Team , AcademicYear
from accounts.serializers import (
    UserSerializer , DepartmentSerializer,
    RegisterSerializer , UpdateUserSerializer , ChangePasswordSerializer ,
    AdminCreateUserSerializer , TeamSerializer, DepartmentDetailSerializer,
    AcademicYearSerializer, AdminUpdateUserSerializer
)

from accounts.permissions import (
    IsAdminOrPrincipal , IsPrincipal , IsAdmin , IsTeacher , IsJudge , 
    IsStudent , CanApproveStudents , CanManageUsers , CanFileComplaint
)

class LoginRateThrottle(AnonRateThrottle):
    scope = 'login'


class RegisterView(APIView):
    permission_classes = [CanApproveStudents]
    
    def post(self,request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    'message': 'Registration successful. Wait for approval.',
                    'user': UserSerializer(user, context={'request': request}).data
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [LoginRateThrottle]
    def post(self,request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)

        if user is None:
            print(username , password)
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if user.role == "student" and not user.is_approved:
            return Response(
                {'error': 'Your account is not approved yet'},
                status=status.HTTP_403_FORBIDDEN
            )

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        response = Response({
            'access': access_token,
            'user': UserSerializer(user, context={'request': request}).data
        })
        
        response.set_cookie(
            key='refresh_token',
            value=str(refresh),
            httponly=True,
            secure=False,
            samesite='Lax',
            max_age=21 * 24 * 60 * 60,
            path='/',
        )

        return response


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        response = Response({'message': 'Logged out successfully.'})

        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception:
                pass  # Token already invalid/expired — still clear the cookie

        # Always clear the cookie on logout
        response.delete_cookie('refresh_token', path='/')
        return response


class CookieTokenRefreshView(APIView):
    """Custom token refresh view that reads refresh token from httpOnly cookie."""
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')

        if not refresh_token:
            return Response(
                {'error': 'No refresh token found.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)

            response = Response({'access': access_token})

            # Rotate the refresh token cookie (optional but more secure)
            response.set_cookie(
                key='refresh_token',
                value=str(refresh),
                httponly=True,
                secure=False,       # Set to True in production (HTTPS)
                samesite='Lax',
                max_age=21 * 24 * 60 * 60,
                path='/',
            )
            return response

        except (TokenError, InvalidToken):
            return Response(
                {'error': 'Invalid or expired refresh token.'},
                status=status.HTTP_401_UNAUTHORIZED
            )


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        return Response(UserSerializer(request.user, context={'request': request}).data)
    
    def patch(self,request):
        serializer = UpdateUserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(UserSerializer(request.user, context={'request': request}).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request):
        serializer = ChangePasswordSerializer(data=request.data,context={'request':request})
        if serializer.is_valid():
            request.user.set_password(serializer.validated_data['new_password'])
            request.user.save()
            return Response({'message': 'Password changed successfully'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [CanApproveStudents()]

    def get_queryset(self):
        qs = User.objects.all().order_by('role', 'username')
        role = self.request.query_params.get('role')
        approved = self.request.query_params.get('approved')
        department = self.request.query_params.get('department')
        is_alumni = self.request.query_params.get('is_alumni')
        is_dropout = self.request.query_params.get('is_dropout')
        search = self.request.query_params.get('search')

        if role:
            qs = qs.filter(role=role)
        if approved is not None:
            qs = qs.filter(is_approved=approved.lower() == 'true')
        if department:
            qs = qs.filter(department_id=department)
        if is_alumni is not None:
            qs = qs.filter(is_alumni=is_alumni.lower() == 'true')
        if is_dropout is not None:
            qs = qs.filter(is_dropout=is_dropout.lower() == 'true')
        if search:
            qs = qs.filter(username__icontains=search)

        return qs


class AdminCreateUserView(generics.CreateAPIView):
    serializer_class = AdminCreateUserSerializer
    permission_classes = [CanApproveStudents]
    

    def get_serializer_context(self):
        return {'request':self.request}


class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return AdminUpdateUserSerializer
        return UserSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH']:
            return [CanManageUsers()]
        return [CanApproveStudents()]

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(UserSerializer(instance, context={'request': request}).data)


class ApproveStudentView(APIView):
    permission_classes = [CanApproveStudents]

    def patch(self, request, pk):
        user = get_object_or_404(User, id=pk, is_approved=False)
        user.is_approved = True
        user.save()
        return Response({
            'message': f'{user.username} approved successfully',
            'user': UserSerializer(user, context={'request': request}).data
        })

    def delete(self, request, pk):
        user = get_object_or_404(User, id=pk)
        username = user.username
        user.delete()
        return Response({
            'message': f'{username} rejected and removed',
        })

class AssignRoleView(APIView):
    permission_classes = [CanManageUsers]
    
    def patch(self, request, pk):
        user = get_object_or_404(User, id=pk)
        new_role = request.data.get('role')
        valid_roles = ['admin', 'principal', 'teacher', 'judge', 'student']

        

        if new_role not in valid_roles:
            return Response(
                {'error': f'Invalid role. Choose from {valid_roles}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.role = new_role
        user.save()
        return Response({
            'message': f'{user.username} role changed to {new_role} successfully',
            'user': UserSerializer(user, context={'request': request}).data
        })


class AssignDepartmentView(APIView):
    permission_classes = [IsAdminOrPrincipal]
    
    def patch(self, request, pk):
        user = get_object_or_404(User, id=pk)
        department_id = request.data.get('department_id')
        if not department_id:
            return Response(
                {'error': 'Department ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        department = get_object_or_404(Department, id=department_id)
        user.department = department
        user.save()
        return Response({
            'message': f'{user.username} department changed to {department.name} successfully',
            'user': UserSerializer(user, context={'request': request}).data
        })


class DepartmentListCreateView(generics.ListCreateAPIView):
    queryset = Department.objects.filter(is_active=True)
    serializer_class = DepartmentSerializer
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]  
        return [IsAdminOrPrincipal()]
    


class DepartmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Department.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return DepartmentDetailSerializer
        return DepartmentSerializer
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [IsAdminOrPrincipal()]

    
class TeamListCreateView(generics.ListCreateAPIView):
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Team.objects.filter(
            is_active=True
        ).prefetch_related('departments')

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [IsAdminOrPrincipal()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class TeamDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [IsAdminOrPrincipal()]


class TeamAddDepartmentView(APIView):
    permission_classes = [IsAdminOrPrincipal]

    def post(self, request, pk):
        team = get_object_or_404(Team, pk=pk)
        dept_id = request.data.get('department_id')
        dept = get_object_or_404(Department, pk=dept_id)

        if dept.teams.filter(is_active=True).exists():
            return Response(
                {'error': f'{dept.name} is already assigned to a team.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        team.departments.add(dept)
        return Response(TeamSerializer(team).data)
    
    def delete(self, request, pk, dept_id=None):
        team = get_object_or_404(Team, pk=pk)
        dept = get_object_or_404(Department, pk=dept_id)
        team.departments.remove(dept)
        return Response(TeamSerializer(team).data)


class AcademicYearListView(generics.ListAPIView):
    serializer_class = AcademicYearSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        show_all = self.request.query_params.get('all', 'false').lower() == 'true'
        qs = AcademicYear.objects.all().order_by('-year')
        if not show_all:
            qs = qs.filter(is_active=True)
        return qs
