from django.contrib import admin
from .models import Batch, Images

# Register your models here.

class ImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'image', 'result', 'created', 'percent')

admin.site.register(Images,ImageAdmin)
admin.site.register(Batch)