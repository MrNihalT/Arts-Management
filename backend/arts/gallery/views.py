from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny
from gallery.models import Gallery
from gallery.serializers import GallerySerializer , GalleryReadSerializer
from accounts.permissions import IsJudge


class GalleryListCreateView(generics.ListCreateAPIView):
    def get_permissions(self):
        if self.request.method == "POST":
            return [IsJudge()]
        return [AllowAny()]
    
    def get_serializer_class(self):
        if self.request.method == "POST":
            return GallerySerializer
        return GalleryReadSerializer
    
    def get_queryset(self):
        queryset = Gallery.objects.prefetch_related(
        'images', 'category'
        ).select_related('program')
        
        program_id = self.request.query_params.get('program')
        category_id = self.request.query_params.get('category')
        ordering = self.request.query_params.get('ordering')

        if program_id:
            queryset = queryset.filter(program_id=program_id)
        
        if category_id:
            queryset = queryset.filter(category__id=category_id)
        if ordering == 'oldest':
            queryset = queryset.order_by('created_at')
        else:
            queryset = queryset.order_by('-created_at') 
            
        return queryset