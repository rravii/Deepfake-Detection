from django.db import models
from django.conf import settings
from PIL import Image
from keras.preprocessing.image import img_to_array
from keras.preprocessing import image
from tensorflow.keras.models import load_model
import cv2, os
import numpy as np
import tensorflow as tf

# Create your models here.
class Images(models.Model):
    image = models.ImageField(upload_to='image')
    result = models.CharField(max_length=2, blank=True)
    updated = models.DateTimeField(auto_now= True)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Images'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)

    def save(self, *args, **kwargs):
        print(self.image)
        img = Image.open(self.image)
        img_array = image.img_to_array(img)
        print(img_array)
        print(img_array.shape)
        img = img_array/255
        # resized_img = cv2.resize(img,(256,256))
        # print(resized_img.shape)

        ready = np.expand_dims(img, axis = 0)
        print(ready.shape)
        
        try:
            file_model = os.path.join(settings.BASE_DIR, 'custom_model_dense48.h5')
            graph = tf.compat.v1.get_default_graph()

            with graph.as_default():
                model = load_model(file_model)
                pred = np.argmax(model.predict(ready), axis = 1)
                self.result = str(pred)
                print(f'classified as {pred}')
        except:
            print("Failed to clasiify")
            self.result = "failed to clasify"
        return super().save(*args, **kwargs)