from django.db import models
from accounts.models import User

# Create your models here.
class Complaint(models.Model):
    STATUS_CHOICE = (
        ('new', 'New'),
        ('in_review', 'In Review'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    )
    user = models.ForeignKey(User,on_delete=models.SET_NULL,null=True,blank=True,related_name='complaints')
    title = models.CharField(max_length=255)
    description = models.TextField()
    email = models.EmailField()
    message = models.TextField()
    attachment = models.FileField(upload_to='attachments/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICE, default='new')
    reponse = models.TextField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
    def __str__(self):
        return f'{self.title} - {self.status}'