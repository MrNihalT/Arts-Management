from django.urls import path
from accounts import views

urlpatterns = [

    # Auth
    path('register/',views.RegisterView.as_view(), name='register'),
    path('login/',views.LoginView.as_view(), name='login'),
    path('logout/',views.LogoutView.as_view(), name='logout'),
    path('token/refresh/', views.CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('me/',views.MeView.as_view(), name='me'),
    path('change-password/',views.ChangePasswordView.as_view(), name='change_password'),

    # User management
    path('users/',views.UserListView.as_view(), name='user_list'),
    path('users/create/',views.AdminCreateUserView.as_view(), name='create_user'),
    path('users/<int:pk>/',views.UserDetailView.as_view(), name='user_detail'),
    path('users/<int:pk>/approve/',views.ApproveStudentView.as_view(), name='approve_student'),
    path('users/<int:pk>/reject/',views.ApproveStudentView.as_view(), name='reject_student'),
    path('users/<int:pk>/assign-role/',views.AssignRoleView.as_view(), name='assign_role'),
    path('users/<int:pk>/assign-department/',views.AssignDepartmentView.as_view(), name='assign_department'),
    
    # Departments
    path('departments/',views.DepartmentListCreateView.as_view(), name='department_list'),
    path('departments/<int:pk>/',views.DepartmentDetailView.as_view(), name='department_detail'),


    # Academic Years
    path('academic-years/',views.AcademicYearListView.as_view(), name='academic_year_list'),

    # Teams
    path('teams/',views.TeamListCreateView.as_view(), name='team_list'),
    path('teams/<int:pk>/',views.TeamDetailView.as_view(), name='team_detail'),
    path('teams/<int:pk>/add-department/',views.TeamAddDepartmentView.as_view(), name='team_add_dept'),
    path('teams/<int:pk>/remove-department/<int:dept_id>/',views.TeamAddDepartmentView.as_view(), name='team_remove_dept'),
]