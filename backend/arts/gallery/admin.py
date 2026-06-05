from django.contrib import admin
from gallery.models import Gallery , GalleryImage , Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']
    list_filter = ['name']
    search_fields = ['name']

@admin.register(Gallery)
class GalleryAdmin(admin.ModelAdmin):
    list_filter = ['program']
    search_fields = ['program']

@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ['gallery','image']
    list_filter = ['image','uploaded_at','gallery']
