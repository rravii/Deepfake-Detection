from rest_framework import serializers
from ..models import Images

class ImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Images
        fields = ('id', 'image', 'result')