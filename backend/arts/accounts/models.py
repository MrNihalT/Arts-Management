from django.db import models
from django.contrib.auth.models import AbstractUser


class Department(models.Model):
    name = models.CharField(max_length=100,unique=True)
    code = models.CharField(max_length=10,unique=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.name


class AcademicYear(models.Model):
    year = models.PositiveIntegerField(unique=True)
    name = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.year})"
        

class Team(models.Model):
    name = models.CharField(max_length=100)
    departments = models.ManyToManyField(Department, related_name='teams')
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(
        'User', on_delete=models.SET_NULL,
        null=True, blank=True
    )

    class Meta:
        unique_together = ('academic_year', 'name')  

    def __str__(self):
        return f"{self.name} ({self.academic_year.year if self.academic_year else 'No Year'})"
    
class User(AbstractUser):
    ROLES = (
        ('admin', 'Admin'),
        ('principal', 'Principal'),
        ('vice_principal', 'Vice Principal'),
        ('teacher', 'Teacher'),
        ('judge', 'Judge'),
        ('student', 'Student'),
    )
    role = models.CharField(max_length=20, choices=ROLES,default='student')
    is_approved = models.BooleanField(default=True)
    
    department = models.ForeignKey(Department,on_delete=models.SET_NULL,null=True,blank=True,related_name="members")
    phone = models.CharField(max_length=15, unique=True, blank=True, null=True, default=None)
    profile_photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)

    admission_year = models.ForeignKey(AcademicYear, on_delete=models.SET_NULL, null=True, blank=True, related_name='admitted_students')
    expected_graduation_year = models.PositiveIntegerField(null=True, blank=True)
    is_alumni = models.BooleanField(default=False)
    is_dropout = models.BooleanField(default=False)

    @property
    def team(self):
        if self.department:
            active_year = self.admission_year or AcademicYear.objects.filter(is_active=True).order_by('-year').first()
            return self.department.teams.filter(
                is_active=True,
                academic_year=active_year
            ).first()
        return None
    
    def __str__(self):
        return f"{self.username}  ({self.role})"
