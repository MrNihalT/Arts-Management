from django.db import models
from accounts.models import Team
from programs.models import ArtsProgram
from participation.models import Participation


class Result(models.Model):
    program = models.OneToOneField(ArtsProgram,on_delete=models.CASCADE,related_name='result',null=True,blank=True)
    published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.published:
            from results.services import calculate_program_result
            calculate_program_result(self)

    def __str__(self):
        if self.program:
            return f"{self.program.name} - Result"
        return "No Program - Result"
    

class ResultPosition(models.Model):
    result = models.ForeignKey(
        Result,
        on_delete=models.CASCADE,
        related_name='positions'
    )

    participation = models.ForeignKey(
        Participation,
        on_delete=models.CASCADE,
        related_name='result_positions'
    )

    team = models.ForeignKey(
        Team,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='result_positions'
    )

    position = models.PositiveIntegerField()  
    points = models.PositiveIntegerField()    
    score = models.FloatField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('result', 'position')
        ordering = ['position']

    def __str__(self):
        return f"{self.result.program.name} - Position {self.position}"