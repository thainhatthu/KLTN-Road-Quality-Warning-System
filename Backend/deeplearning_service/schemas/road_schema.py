from pydantic import BaseModel, Field
from Database import Postgresql

class ImageSchema(BaseModel):
    id: int = Field(..., description="Id of the image")
    level: str = Field(..., description="Level of road")

    def setLevel(self):
        db = Postgresql()
        db.update('road', f"level='{self.level}'", f"id={self.id}")
        db.commit()
        db.close()
        return True