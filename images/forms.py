from django import forms
from .models import Images

class ImageForm(forms.ModelForm):

    image = forms.ImageField(widget=forms.ClearableFileInput(attrs={"class": "form-control", "multiple" : True, "required" : True, "name" : "image"}))

    class Meta:
        model = Images
        fields = ['image']