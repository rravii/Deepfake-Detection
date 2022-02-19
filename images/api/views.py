from rest_framework import viewsets
from ..models import Images
from .serializers import ImagesSerializer

class ImagesViewSet(viewsets.ModelViewSet):
    serializer_class = ImagesSerializer
    queryset = Images.objects.all()