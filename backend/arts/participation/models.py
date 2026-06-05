from django.db import models
from accounts.models import User, AcademicYear
from programs.models import ArtsProgram , ArtsFest


class Participation(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='participations'
    )
    program = models.ForeignKey(
        ArtsProgram,
        on_delete=models.CASCADE,
        related_name='participations'
    )
    arts_fest = models.ForeignKey(
        ArtsFest,
        on_delete=models.CASCADE,
        related_name='participations'
    )
    academic_year = models.ForeignKey(
        AcademicYear,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='participations'
    )
    team_members = models.ManyToManyField(
        User,
        related_name='team_participations',
        blank=True,
        help_text="For team events, the students participating in this group."
    )
    is_winner = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_winner', '-created_at']
        unique_together = ['user', 'program']

    def __str__(self):
        return f"{self.user.username} - {self.program.name}"
