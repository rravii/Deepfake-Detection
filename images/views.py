import imp
from django.shortcuts import render
from .forms import ImageForm
from .models import Images
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.views.generic import TemplateView

# MTCNN
import cv2
from deepfake_detection.settings import MEDIA_ROOT
import os
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from matplotlib import pyplot as plt
from facenet_pytorch import MTCNN
from PIL import Image
import numpy as np 
import torch

class MainView(TemplateView):
    template_name = 'form.html'

# Create your views here.
def home(request):
    file_list = []

    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    mtcnn = MTCNN(margin=120, image_size = 256, keep_all=True, post_process=False, device= device)

    if request.method == "POST":
        # form = ImageForm(request.POST, request.FILES)
        # if form.is_valid():
            # files = request.FILES.getlist('image')
            files = request.FILES.getlist('file')
            print(files)

            for file in files:
                img1 = Image.open(file)
                img1 = np.array(img1)
                print(img1.shape)
                
                if img1.shape[2] == 4:
                    img = img1[:,:,:3]
                else:
                    img = img1

                print(img)

                
                faces = mtcnn(img)
                for i in range(len(faces)):
                    
                    face_img = faces[i].permute(1, 2, 0).numpy()
                    face_img = cv2.cvtColor(face_img, cv2.COLOR_BGR2RGB)
                    ret, buf = cv2.imencode('.jpg', face_img)
                    content = ContentFile(buf.tobytes())

                    new_file = Images()

                    new_file.image.save(str(i) + str(file), content)
                    file_list.append(new_file.image.url)
                
                print(len(faces))
                

    # form = ImageForm()

    return render(request, 'form.html', {'image_list' : file_list})