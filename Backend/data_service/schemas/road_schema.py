from pydantic import BaseModel, Field, root_validator
from Database import Postgresql
from datetime import datetime
import time
import os
from PIL import Image
from io import BytesIO
current_file_path = os.path.abspath(__file__)


class RoadSchema(BaseModel):
    id: int = Field(None, description="Id of the image")
    user_id: int =Field(None, description="User own imgae")
    username: str = Field(None, description="Username")
    file: bytes = Field(None, description="Image file")
    filepath: str = Field(None, description="File path")
    latitude: float = Field(None, description="Latitude of the location")
    longitude: float = Field(None, description="Longitude of the location")
    level: str = Field(None, description="Level of road")
    created_at: datetime = Field(None, description="Created at")
    ward_id: int = Field(None, description="District id")
    location: str = Field("unknow", description="Location")
    location_part: list = Field([], description="Address raw")
    update_at: datetime = Field(None, description="Update at")
    status: str = Field(None, description="Status of road")
    
    @root_validator(pre=True)
    def resolve_user_id(cls, values):
        if not values.get('user_id') and values.get('username'):
            db = Postgresql()
            username = values['username']
            result = db.execute(f"SELECT id FROM account WHERE username ='{username}'", fetch='one')
            if result:
                values['user_id'] = result[0]
            else:
                raise ValueError(f"Username '{username}' không tồn tại trong cơ sở dữ liệu.")
        if values.get('file'):
            image = Image.open(BytesIO(values['file']))
            resized_image = image.resize((512,512), Image.LANCZOS)
            output_buffer = BytesIO()
            resized_image.save(output_buffer, format=image.format) 
            values["file"] = output_buffer.getvalue()
        return values

    def insertRoad(self):
        db = Postgresql()
        file_path = f"roadImages/{self.user_id}_{time.time()}.jpg"
        if self.location !=None:
            self.ward_id=db.execute(f"SELECT w.id FROM ward w JOIN district d on w.district_id=d.id JOIN province p on d.province_id=p.id WHERE w.name ilike'%{self.location_part[0]}%' and d.name ilike'%{self.location_part[1]}%' and p.name ilike'%{self.location_part[2]}%'")[0]
        id=db.execute(f"INSERT INTO road (user_id,image_path,latitude,longitude,level,ward_id,location) VALUES ({self.user_id},'{file_path}',{self.latitude},{self.longitude},'Classifying',{self.ward_id},'{self.location}') RETURNING id")
        db.commit()
        db.close()
        with open(file_path , "wb") as f:
            f.write(self.file)
        return id
        
    def deleteRoad(self):
        try:
            db = Postgresql()
            file_path = db.execute(f"SELECT image_path FROM road WHERE id={self.id}")[0]
            os.remove(file_path)
            db.execute(f"DELETE FROM road WHERE id={self.id}",fetch='none')
            db.commit()
            db.close()
            return True
        except Exception as e:
            print(current_file_path, e)
            return False
    
    def reformat(self):
        self.filepath = f"/datasvc/api/getImage?imagePath={self.filepath}"
        attributes_to_remove = ['file', 'location_part', 'username',]
        for attr in attributes_to_remove:
            if hasattr(self, attr):
                delattr(self, attr)
        
        return self
        return self

    def update(self):
        fields_can_update = ['latitude', 'longitude', 'location', 'ward_id','status','user_id']
        try:
            db = Postgresql()
            old_values=db.execute(f"SELECT * FROM road WHERE id={self.id}",fetch='one')
            if self.location_part:
                ward_id = db.execute(f"SELECT w.id FROM ward w JOIN district d on w.district_id=d.id JOIN province p on d.province_id=p.id WHERE w.name ilike'%{self.location_part[0]}%' and d.name ilike'%{self.location_part[1]}%' and p.name ilike'%{self.location_part[2]}%'")[0]
                self.ward_id = ward_id
            fields = {field: getattr(self, field) for field in fields_can_update if getattr(self, field) is not None}
            set_clause = ", ".join([f"{field} = '{fields[field]}'" for field in fields])
            db.execute(f"UPDATE road SET {set_clause} WHERE id={self.id}",fetch='none')
            db.commit()
            new_values=db.execute(f"SELECT * FROM road WHERE id={self.id}",fetch='one')
            db.close()
            return old_values,new_values
        except Exception as e:
            print(current_file_path, e)
            return None,None

    def checkPermission(self):
        db = Postgresql()
        permission=db.execute(f"SELECT 1 FROM road full join account on road.user_id=account.id full join role on role.user_id=account.id WHERE (road.id={self.id} and account.username='{self.username}') or (role.permission_id=1 and account.username='{self.username}')")
        db.close()
        return True if permission else False

    def checkExist(self):
        db = Postgresql()
        result = db.execute(f"SELECT 1 FROM road WHERE id={self.id}")
        db.close()
        return True if result else False
    
    def getinfoRoad(self,fields:str):
        db = Postgresql()
        ward_id = db.execute(f"SELECT {fields} FROM road WHERE id={self.id}")
        db.close()
        return ward_id[0] if ward_id else None