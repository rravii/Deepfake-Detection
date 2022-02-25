import imp
from django.shortcuts import render
from .forms import ImageForm
from .models import Images
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.views.generic import TemplateView
from django.http import HttpResponse
import json
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
def mtcnn(request):
    file_list = []

    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    mtcnn = MTCNN(margin=120, image_size = 256, keep_all=True, post_process=False, device= device)
    
    if request.method == "POST":
            files = request.FILES.getlist('file')

            for file in files:
                img1 = Image.open(file)
                img1 = np.array(img1)
                
                if img1.shape[2] == 4:
                    img = img1[:,:,:3]
                else:
                    img = img1

                faces = mtcnn(img)
                for i in range(len(faces)):
                    face_img = faces[i].permute(1, 2, 0).numpy()
                    face_img = cv2.cvtColor(face_img, cv2.COLOR_BGR2RGB)
                    ret, buf = cv2.imencode('.jpg', face_img)
                    content = ContentFile(buf.tobytes())

                    new_file = Images()

                    new_file.image.save(str(i) + str(file), content)
                    print(new_file.result)
                    file_list.append({
                        'url':new_file.image.url,
                        'result': new_file.result,
                        'percent': new_file.percent
                    });

    return HttpResponse(json.dumps({
        'images': file_list
    }))