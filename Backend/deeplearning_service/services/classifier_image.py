from torchvision import transforms
import torch
import logging
import torch.utils.data as data
from kafka import KafkaConsumer
import json
from PIL import Image
from io import BytesIO
import base64
from .resevit_road import restevit_road_cls
import numpy as np
from schemas import ImageSchema
import time
import threading

logger = logging.getLogger("Deeplearning_Service")
logger.setLevel(logging.DEBUG)
log_foramt= logging.Formatter('%(asctime)s - Deeplearning_Service - %(levelname)s - %(message)s')

# 1. Handler cho INFO (Ghi vào file logs_info.log)
info_handler = logging.FileHandler("logs/backend.log")
info_handler.setLevel(logging.INFO) 
info_handler.setFormatter(log_foramt)

error_handler = logging.FileHandler("logs/backend.log")
error_handler.setLevel(logging.ERROR)  # Chỉ ghi các log ERROR trở lên
error_handler.setFormatter(log_foramt)
logger.addHandler(info_handler)
logger.addHandler(error_handler)

road_image_path="road_image"

class ImageTransform():
    def __init__(self, resize, mean =(0.485, 0.456, 0.406), std =  (0.229, 0.224, 0.225)):
        self.data_transform = {
             'Test':  transforms.Compose([
                transforms.RandomResizedCrop(resize, scale=(0.7,1.0)),
                transforms.ToTensor(),
                transforms.Normalize(mean=mean, std=std)])
        }
    
    def __call__(self, img, phase='Test'):
        return self.data_transform[phase](img)


def classifier_road(img):
    model=restevit_road_cls(num_class=4)
    checkpoint = torch.load('models/ResEViT_multiclass.pth',map_location=torch.device("cpu"))
    model.load_state_dict(checkpoint)
    img=ImageTransform(224)(img)
    model.eval()
    img=img.unsqueeze(0)
    result= model(img)
    max_id = np.argmax(result.detach().numpy(),axis=1)
    if max_id==0:
        return 'Good'
    elif max_id==1:
        return 'Poor'
    elif max_id==2:
        return 'Satisfactory'
    else:
        return 'Very poor'



def getRoadImage():
    consumer=consumer = KafkaConsumer(
        'image',
        bootstrap_servers='192.168.120.26:9092',
        auto_offset_reset='earliest',
        enable_auto_commit=False,
        group_id='road_classifier',
        value_deserializer=lambda v: json.loads(v.decode('utf-8')),
        client_id='deeplearning_service',
        max_poll_interval_ms=300000 
    )
    for message in consumer:
        try:
            timestamp = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime())
            consumer.commit()
            json_data = message.value
            id=json_data['id']
            image_data = base64.b64decode(json_data['file'])
            image = Image.open(BytesIO(image_data))
            if image.mode != 'RGB':
                image = image.convert('RGB')
            level=classifier_road(image)
            imageSchema=ImageSchema(id=id,level=level)
            imageSchema.setLevel()
            logger.info(f'Image {id} classified as {level}')
        except Exception as e:
            logger.error(e)
            continue
thread=threading.Thread(target=getRoadImage)
thread.start()
