from django.contrib import admin
from .models import Images

# Register your models here.
admin.site.register(Images)

class ImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'image', 'created')
