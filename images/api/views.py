from rest_framework import viewsets, response, status
from ..models import Images
from .serializers import ImagesSerializer

class ImagesViewSet(viewsets.ModelViewSet):
    serializer_class = ImagesSerializer
    queryset = Images.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        print('dem')
        headers = self.get_success_headers(serializer.data)
        return response.Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)