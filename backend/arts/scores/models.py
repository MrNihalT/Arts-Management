from django.db import models
from django.core.validators import MinValueValidator ,  MaxValueValidator
from accounts.models import User , Department
from participation.models import Participation
from programs.models import ArtsFest, ArtsProgram


# Create your models here.
class Score(models.Model):
    participation = models.OneToOneField(
        Participation,
        on_delete=models.CASCADE,
        related_name='score'
    )
    
    judge = models.ForeignKey(User,on_delete=models.SET_NULL,null=True,blank=True,related_name='scores')
    obtained_score = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def department(self):
        user = self.participation.user
        if user and user.department:
            return user.department.name
        return "-"
    def __str__(self):
        return f"{self.participation.user.username} - {self.obtained_score}"
