from django.db import models
from django.conf import settings
from PIL import Image
from keras.preprocessing.image import img_to_array
from keras.preprocessing import image
from tensorflow.keras.models import load_model
import cv2, os
import numpy as np
import tensorflow as tf

# Models Creation.
class Images(models.Model):
    image = models.ImageField(upload_to='image')
    result = models.CharField(max_length=5, blank=True)
    percent = models.FloatField(max_length=10, blank=True, null=True)
    updated = models.DateTimeField(auto_now= True)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Images'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.id)

    def save(self, *args, **kwargs):
        prediction_class = ["Fake", "Real"]
        img = Image.open(self.image)
        img_array = image.img_to_array(img)
        img = img_array/255
        ready = np.expand_dims(img, axis = 0)
        
        try:
            file_model = os.path.join(settings.BASE_DIR, 'custom_model_dense48.h5')
            graph = tf.compat.v1.get_default_graph()

            with graph.as_default():
                model = load_model(file_model)
                prediction = model.predict(ready)
                pred = np.argmax(prediction, axis = 1)
                percent = prediction[0][pred] * 100
                percent = int(percent * 1000)/1000;
                pred = prediction_class[pred[0]]
                print(pred)
                self.result = str(pred)
                self.percent = str(percent)
        except:
            self.result = "failed to clasify"
        return super().save(*args, **kwargs)