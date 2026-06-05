from rest_framework import serializers
from gallery.models import Category, Gallery, GalleryImage


class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage   
        fields = ['image']


class GallerySerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True
    )

    class Meta:
        model = Gallery
        fields = ['program', 'category', 'images']

    def create(self, validated_data):  
        images = validated_data.pop('images')
        categories = validated_data.pop('category', [])

        gallery = Gallery.objects.create(**validated_data)

        if categories:
            gallery.category.set(categories)

        for image in images:
            GalleryImage.objects.create(gallery=gallery, image=image)

        return gallery


class GalleryReadSerializer(serializers.ModelSerializer):
    images = GalleryImageSerializer(many=True, read_only=True)
    program_name = serializers.CharField(source='program.name', read_only=True)
    category = serializers.SlugRelatedField(many=True, read_only=True, slug_field='name')

    class Meta:
        model = Gallery
        fields = ['id', 'program', 'program_name', 'category', 'images']