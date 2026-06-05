from django.db import models
from programs.models import ArtsProgram
# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=50)
    def __str__(self):
        return self.name


class Gallery(models.Model):
    program = models.ForeignKey(ArtsProgram,on_delete=models.CASCADE,related_name='gallery',null=True,blank=True)
    category = models.ManyToManyField(Category,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.program.name} Gallery"


class GalleryImage(models.Model):
    gallery = models.ForeignKey(
        Gallery,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(upload_to='gallery/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.gallery.program.name}"