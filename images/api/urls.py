from .views import ImagesViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'image', ImagesViewSet)
urlpatterns = router.urls
