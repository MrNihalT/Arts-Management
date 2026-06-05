from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from accounts.models import User , Department , Team , AcademicYear


class AcademicYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicYear
        fields = ['id', 'year', 'name', 'start_date', 'end_date', 'is_active']


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id','name','code','is_active']


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id','name','departments','academic_year','is_active']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True,required=True,validators=[validate_password])
    password2 = serializers.CharField(write_only=True,required=True)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password2',
            'first_name', 'last_name', 'phone', 'department',
            'admission_year', 'expected_graduation_year'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {'password': 'Passwords do not match.'}
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = User.objects.create_user(
            **validated_data,
            password=password,
            role='student',
            is_approved=False
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True)
    team = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = [
            'id','username','email','first_name','last_name',
            'phone','department','role','is_approved','team','profile_photo',
            'admission_year', 'expected_graduation_year', 'is_alumni', 'is_dropout'
            ]
        read_only_fields = ['role', 'is_approved']
    
    def get_team(self, obj):
        team = obj.team
        if team:
            return {'id': team.id, 'name': team.name}
        return None


class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'phone','profile_photo', 'expected_graduation_year']


class AdminUpdateUserSerializer(serializers.ModelSerializer):
    department_id = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(), source='department', required=False, allow_null=True
    )
    admission_year_id = serializers.PrimaryKeyRelatedField(
        queryset=AcademicYear.objects.all(), source='admission_year', required=False, allow_null=True
    )
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'first_name', 'last_name', 'phone',
            'department_id', 'admission_year_id', 'expected_graduation_year',
            'is_alumni', 'is_dropout'
        ]


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True,write_only=True,validators=[validate_password])
    
    
    def validate_old_password(self,value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Old password is not correct')
        return value


class AdminCreateUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model  = User
        fields = [
            'username', 'email', 'password', 'first_name',
            'last_name', 'role', 'phone', 'department',
            'admission_year', 'expected_graduation_year', 'is_alumni', 'is_dropout'
        ]

    def validate_role(self,value):
        request_user = self.context['request'].user

        if value == 'admin' and request_user.role != 'admin':
            raise serializers.ValidationError(
                'Only admin can create another admin account.'
            )
            
        if request_user.role == 'teacher' and value != 'student':
            raise serializers.ValidationError(
                'Teachers can only create student accounts.'
            )
            
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data, password=password, is_approved=True)
        return user


class DepartmentDetailSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)
    teams = TeamSerializer(many=True, read_only=True)

    class Meta:
        model = Department
        fields = ['id', 'name', 'code', 'is_active', 'members', 'teams']

    


