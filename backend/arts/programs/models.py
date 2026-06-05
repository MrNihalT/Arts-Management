from django.db import models
from accounts.models import AcademicYear, User



class ArtsFest(models.Model):
    name = models.CharField(max_length=200)
    year = models.PositiveIntegerField(help_text="The year the Arts Fest is conducted in.")
    max_programs_per_student = models.PositiveIntegerField(default=3, help_text="Max items a student can participate in")
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='created_arts_fests'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-year']

    def __str__(self):
        return f"{self.name} ({self.year})"


class ArtsProgram(models.Model):
    arts_fest = models.ForeignKey(
        ArtsFest,
        on_delete=models.CASCADE,
        related_name='programs',
        null=False, blank=False,
        help_text="The Arts Fest this program is held in."
    )
    name = models.CharField(max_length=200)

    event_image = models.FileField(upload_to='event_images/', blank=True, null=True,default="/event_images/default.jpg")
    eligible_batches = models.ManyToManyField(
        AcademicYear,
        related_name='eligible_programs',
        blank=True,
        help_text=(
            "Select the student admission-year batches allowed to participate "
            "(e.g. 2023-26, 2024-27). Leave empty to allow ALL current students."
        )
    )

    description = models.TextField(blank=False,null=False)
    venue = models.CharField(max_length=200, blank=False,null=False)
    is_team_based = models.BooleanField(default=False)
    max_participants = models.PositiveIntegerField(null=True, blank=True, help_text="Maximum number of participants allowed")
    max_team_members = models.PositiveIntegerField(null=True, blank=True)
    rules = models.TextField(blank=False,null=False)

    # Visibility control
    is_active = models.BooleanField(
        default=True,
        help_text="Only active programs are visible to students."
    )
    # Graduate restriction
    is_graduate_restricted = models.BooleanField(
        default=True,
        help_text="If True, alumni / graduated students cannot participate."
    )

    last_date = models.DateField(null=False, blank=False)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='created_programs'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('arts_fest', 'name')
        ordering = ['-arts_fest__year', 'name']

    def __str__(self):
        return f"{self.name} ({self.arts_fest.year})"

    @property
    def total_participants(self):
        return self.participation.count()
    @property
    def total_teams(self):
        return self.teams.count()

    @property
    def top_scores(self):
        from scores.models import Score
        return Score.objects.filter(
            participation__program=self
        ).order_by('-obtained_score')[:5]
       
