from main import app
from services import RoadService,validate_token,RouteMap
from fastapi import File, UploadFile,Form, Depends
from fastapi.responses import JSONResponse
from schemas import RoadSchema
import os
from typing import Literal
current_file_path = os.path.abspath(__file__)


@app.post("/api/uploadRoad")
async def upload_image(file: UploadFile = File(...), latitude: float = Form(...),longitude: float=Form(...), uservalidate = Depends(validate_token)):
    try:
        if not file.content_type.startswith("image/"):
            return JSONResponse(content={"status": "error", "message": "Only image files are allowed"}, status_code=400)
        road = RoadSchema(
            username=uservalidate['username'],
            file=await file.read(),
            latitude=latitude,
            longitude=longitude
        )
        if  not await RoadService.insertRoad(road):
            return JSONResponse(content={"status": "error", "message": "Internal server error"}, status_code=500)  
        return JSONResponse(content={"status": "success", "message": "Image uploaded successfully"}, status_code=200)
    except Exception as e:
        print(current_file_path, e)
        return JSONResponse(content={"status": "error", "message": "Internal server error"}, status_code=500)


@app.delete("/api/deleteRoad")
def delete_imageRoad(id_road: int, uservalidate = Depends(validate_token)):
    try:
        return RoadService.deleteRoad(id_road, uservalidate['username'])
    except Exception as e:
        print(current_file_path, e)
        return JSONResponse(content={"status": "error", "message": "Internal server error"}, status_code=500)

@app.get("/api/getInfoRoads")
def get_roads(user_id: int=None, id_road: int=None, ward_id=None, all: bool=False, getDone: bool=False):
    try: 
        return RoadService.getlistRoad(user_id, id_road, ward_id, all,getDone)
    except Exception as e:
        print(current_file_path, e)
        return JSONResponse(content={"status": "error", "message": "Internal server error"}, status_code=500)

@app.get("/api/getRouteMap")
async def get_route_map():
    try:
        return RouteMap.get_route_map()
    except Exception as e:
        print(current_file_path, e)
        return JSONResponse(content={"status": "error", "message": "Internal server error"}, status_code=500)
    
@app.patch("/api/updateLocationRoad")
async def update_locationRoad(id:int,latitude:float,longitude:float,uservalidate = Depends(validate_token)):
    try:
        return RoadService.updateLocationRoad(id,latitude,longitude,uservalidate['username'])
    except Exception as e:
        print(current_file_path, e)
        return JSONResponse(content={"status": "error", "message": "Internal server error"}, status_code=500)

@app.get("/api/statisticsRoad")
async def statistics_road(during: Literal["monthly", "yearly"] = "monthly",number:int=1,uservalidate = Depends(validate_token)):
    try:
        return RoadService.statistics_road(during,number,uservalidate['role'])
    except Exception as e:
        print(current_file_path, e)
        return JSONResponse(content={"status": "error", "message": "Internal server error"}, status_code=500)