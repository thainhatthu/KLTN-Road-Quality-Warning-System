from schemas import RoadSchema
from kafka import KafkaProducer
import json
import base64
from fastapi.responses import JSONResponse
from Database import Postgresql
import os
from .routemap_service import RouteMap
from geopy.geocoders import Nominatim
import threading

current_file_path = os.path.abspath(__file__)

def get_location(lat, lon):
    try:
        geolocator = Nominatim(user_agent='n3twork@gmail.com')
        location = geolocator.reverse((lat, lon), language="vi")
        if location:
            location = location.raw.get('display_name')
            location_part = location.split(', ')
            province = location_part[-3]
            district = location_part[-4]
            ward = location_part[-5]
            location=", ".join(location_part[:-2])
            print(location, [ward, district, province])
            return location,[ward, district, province]
        else:
            return None, []
    except Exception as e:
            print(e)
            return None, []


class RoadService:
    @staticmethod
    async def insertRoad(roadSchema: RoadSchema):
        try: 
            latitude = roadSchema.latitude
            longitude = roadSchema.longitude
            roadSchema.location,roadSchema.location_part = get_location(latitude, longitude)
            id=roadSchema.insertRoad()[0]
            threading.Thread(target=RouteMap,args=([roadSchema.ward_id],)).start()
            img=roadSchema.file
            producer=KafkaProducer(
                bootstrap_servers='kafka:9092',
                value_serializer=lambda v: json.dumps(v).encode('utf-8')
            )
            message={
                "id":id,
                "file": base64.b64encode(img).decode('utf-8'),
            }
            producer.send('image', message)
            producer.flush()
            return True
        except Exception as e:
            print(current_file_path, e)
            return False


    @staticmethod
    def getlistRoad(user_id=None,id_road=None,ward_id=None,all=False,getDone=False):
        try:
            db=Postgresql()
            query=f'''
            SELECT id, user_id,latitude,longitude,level,image_path,created_at,location,ward_id,status 
            FROM road 
            where ((level <> 'Good' and level <> 'Classifing') or {all} or ({getDone} and status='Done')) and 
            ({not id_road} or id={id_road if id_road else -1}) and
            ({not user_id} or user_id='{user_id if user_id else -1}') and 
            ({not ward_id} or ward_id='{ward_id if ward_id else -1}') 
            '''
            roads=db.execute(query,fetch='all')           
            db.close()
            road_schemas = [
                RoadSchema(
                    id=id,
                    user_id=user_id,
                    latitude=latitude,
                    longitude=longitude,
                    level=level,
                    filepath=filepath,
                    created_at=created_at,
                    location=location,
                    ward_id=ward_id,
                    status=status
                )
                for id, user_id, latitude, longitude, level, filepath, created_at,location,ward_id,status in roads
            ]
            data=[road.reformat().json() for road in road_schemas]
            return JSONResponse(content={
                "status": "success",
                "data": data,
                "message": "Get info road successfully"
                },status_code=200)
        except Exception as e:
            print(current_file_path, e)
            return JSONResponse(content={"status": "error", "message": "Internal server error"}, status_code=500)

    @staticmethod
    def deleteRoad(id_road, username):
        try: 
            roadSchema=RoadSchema(id=id_road,username=username)
            if (not roadSchema.checkExist()): 
                return JSONResponse(content={"status": "error", "message": "Road not found"}, status_code=404)
            if (not roadSchema.checkPermission()):
                return JSONResponse(content={"status": "error", "message": "You don't have permission to delete this road"}, status_code=403)
            ward_id=roadSchema.getinfoRoad('ward_id')
            if not roadSchema.deleteRoad():
                return JSONResponse(content={"status": "error", "message": "Delete not successful"}, status_code=400)
            threading.Thread(target=RouteMap,args=([ward_id],)).start()
            return JSONResponse(content={"status": "success", "message": "Road was deleted successfully"}, status_code=200)
        except Exception as e:
            print(current_file_path, e)
            return JSONResponse(content={"status": "error", "message": "Internal server error"}, status_code=500)

    def updateLocationRoad(id,latitude,longitude,username):
        try:
            roadSchema=RoadSchema(id=id,latitude=latitude,longitude=longitude,username=username)
            if not roadSchema.checkExist():
                return JSONResponse(content={"status": "error", "message": "Road not found"}, status_code=404)
            if not roadSchema.checkPermission():
                return JSONResponse(content={"status": "error", "message": "You don't have permission to update this road"}, status_code=403)
            location,location_part = get_location(latitude, longitude)
            roadSchema.location=location
            roadSchema.location_part=location_part
            old_value,new_value=roadSchema.update()
            if not old_value:
                return JSONResponse(content={"status": "error", "message": "Update not successful"},status_code=400)
            ward_ids=[old_value[7],new_value[7]]
            threading.Thread(target=RouteMap,args=(ward_ids,)).start()
            return JSONResponse(content={"status": "success", "message": "Location was updated successfully"}, status_code=200)
        except Exception as e:
            print(current_file_path, e)
            return JSONResponse(content={"status": "error", "message": "Internal server error"}, status_code=500)

    def statistics_road(during,number,role):
        try:
            if role != 'admin':
                return JSONResponse(content={"status": "error", "message": "You don't have permission to access this feature"}, status_code=403)
            days= (30 if during=='monthly' else 365)*number
            db=Postgresql()
            count_all=db.execute(f"SELECT level, count(level) FROM road where level <> 'Good' and level <> 'Classifing' and created_at >= NOW() - INTERVAL '{days} days' group by level",fetch='all')
            count_done=db.execute(f"SELECT level, count(level) FROM road where level <> 'Good' and level <> 'Classifing' and status='Done' and created_at >= NOW() - INTERVAL '{days} days' group by level",fetch='all')
            db.close()
            data={
                'Total':[f"'{level}': {count}" for level,count in  count_all],
                'Done':[f"'{level}': {count}" for level,count in  count_done]
            }
            return JSONResponse(content={
                "status": "success",
                "data": data,
                "message": "Get statistics road successfully"
                },status_code=200)
        except Exception as e:
            print(current_file_path, e)
            return JSONResponse(content={"status": "error", "message": "Internal server error"}, status_code=500)