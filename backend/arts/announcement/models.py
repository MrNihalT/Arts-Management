from django.db import models
from programs.models import ArtsProgram



class Announcement(models.Model):
    title = models.CharField(max_length=250)
    message = models.TextField()
    link = models.URLField(blank=True,null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.created_at}"


class ProgramSchedule(models.Model):
    program = models.OneToOneField(ArtsProgram,on_delete=models.CASCADE,related_name='schedule',null=True,blank=True)
    message = models.TextField(null=True,blank=True)
    start_at = models.DateTimeField(null=False,blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.program.name} - Schedule"

