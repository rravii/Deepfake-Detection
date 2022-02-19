from django.shortcuts import render
from .forms import ImageForm
from .models import Images
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

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

# Create your views here.
def home(request):
    file_list = []

    mtcnn = MTCNN(margin=120, image_size = 256, keep_all=True, post_process=False)

    if request.method == "POST":
        form = ImageForm(request.POST, request.FILES)
        if form.is_valid():
            files = request.FILES.getlist('image')

            for file in files:
                # img = Image.open(file)
                # print(str(img))
                # if not str(img).endswith('.jpg'):
                #     filename, fext = os.path.splitext(str(img))
                #     print(filename)
                #     print(fext)
                    # store = default_storage.save('{}.jpg', format(filename))
                    # print(target_name)
                # # print(str(MEDIA_ROOT))
                # # plt.savefig(os.path.join(PROJECT_ROOT, str(file)))
                # store = default_storage.save(file, file)
                # print(store)
                # image_path = os.path.join(MEDIA_ROOT, str(store))
                # print(image_path)
                # # img = cv2.cvtColor(cv2.imread(image_path), cv2.COLOR_BGR2RGB)
                # img = cv2.imread(image_path)

                # print(file)
                img1 = Image.open(file)
                img1 = np.array(img1)
                print(img1.shape)
                
                if img1.shape[2] == 4:
                    img = img1[:,:,:3]
                else:
                    img = img1

                print(img)
                # img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                # save_path = os.path.join(MEDIA_ROOT , '_' + str(file))
                # faces = mtcnn(img, save_path);
                
                
                faces = mtcnn(img)
                # os.remove(image_path)
                # path = os.listdir(MEDIA_ROOT)
                # for p in path:
                #     print(os.path.join(MEDIA_ROOT , p))
                for i in range(len(faces)):
                    # img = cv2.imread(os.path.join(MEDIA_ROOT , p))
                    # print(cv2.imread(os.path.join(MEDIA_ROOT, p)))
                    face_img = faces[i].permute(1, 2, 0).numpy()
                    face_img = cv2.cvtColor(face_img, cv2.COLOR_BGR2RGB)
                    # face_img = faces[i]
                    ret, buf = cv2.imencode('.jpg', face_img)
                    content = ContentFile(buf.tobytes())

                # #     #  Saving POST'ed file to storage
                #     file_name = default_storage.save(str(i)+str(file), content)

                    #  Reading file from storage
                    # file = default_storage.open(file_name)
                    # file_url = default_storage.url(file_name)

                    new_file = Images()

                    new_file.image.save(str(i) + str(file), content)
                    file_list.append(new_file.image.url)
                #     print(faces[i].permute(1, 2, 0).int().numpy())
                
                print(len(faces))
                

    form = ImageForm()

    return render(request, 'home.html', {'form':form, 'image_list' : file_list})