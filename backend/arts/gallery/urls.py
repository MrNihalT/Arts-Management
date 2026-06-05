from django.urls import path
from gallery.views import GalleryListCreateView


urlpatterns = [
    path('', GalleryListCreateView.as_view()),
]