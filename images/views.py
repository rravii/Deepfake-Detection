import imp
from django.shortcuts import render
from .forms import ImageForm
from .models import Images, Batch
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
import threading


class ProcessMTCNN(threading.Thread):

    def __init__(self, batch, np_image, file):
        threading.Thread.__init__(self)
        self.batch = batch
        self.np_image = np_image
        self.file = file

    def run(self):
        device = 'cuda' if torch.cuda.is_available() else 'cpu'
        mtcnn = MTCNN(margin=120,
                      image_size=256,
                      keep_all=True,
                      post_process=False,
                      device=device)

        print("cropping images")
        img1 = self.np_image
        file = self.file
        if img1.shape[2] == 4:
            img = img1[:, :, :3]
        else:
            img = img1

        faces = mtcnn(img)
        self.batch.number_of_faces = len(faces)
        self.batch.status = 1
        self.batch.save()
        print('proccessing images')
        for i in range(len(faces)):
            face_img = faces[i].permute(1, 2, 0).numpy()
            face_img = cv2.cvtColor(face_img, cv2.COLOR_BGR2RGB)
            ret, buf = cv2.imencode('.jpg', face_img)
            content = ContentFile(buf.tobytes())

            new_file = Images()

            new_file.image.save(str(i) + str(file), content)
            print(f'processed image {i+1}')
            self.batch.faces_path = self.batch.faces_path + (',' if self.batch.faces_path!='' else '') + str(
                new_file.id)
            self.batch.number_of_processed_faces = i + 1
            self.batch.save()
        self.batch.status = 2
        self.batch.save()


class MainView(TemplateView):
    template_name = 'form.html'

def get_faces(path):
    if path == '':
        return []
    images = [Images.objects.get(id=imageId) if Images.objects.filter(id=imageId).exists() else '' for imageId in path.split(',')]
    valid_data = []
    for image in images:
        if not isinstance(image, str):
            valid_data.append({
                'image': image.image.url,
                'result': image.result,
                'percent': image.percent
            })
    return valid_data

def get_batch(request, id):
    if Batch.objects.filter(id=id).exists():
        batch = Batch.objects.get(id=id)
        return HttpResponse(json.dumps({'batch': {
            'number_of_faces': batch.number_of_faces,
            'number_of_processed_faces': batch.number_of_processed_faces,
            'faces_path': get_faces(batch.faces_path),
            'created':str(batch.created),
            'completed': str(batch.completed),
            'status': batch.status
        }}))
    return HttpResponse(json.dumps({'batch': None}))


# Create your views here.
def mtcnn(request):
    batches = []

    if request.method == "POST":
        files = request.FILES.getlist('file')
        for file in files:
            batch = Batch.objects.create()
            img1 = Image.open(file)
            img1 = np.array(img1)
            ProcessMTCNN(batch=batch, np_image=img1, file=str(file)).start()
            batches.append(batch.id)

    return HttpResponse(json.dumps({'batches': batches}))
