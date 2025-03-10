from main import app
from fastapi.responses import FileResponse, JSONResponse
import os


@app.get("/api/getImage")
async def get_image(imagePath: str):
    try:
        if os.path.exists(imagePath):
            return FileResponse(imagePath)
        else:
            return JSONResponse(content={"status": "error", "message": "Image not found"}, status_code=404)
    except Exception as e:
        print(e)
        return JSONResponse(content={"status": "error", "message": "Internal server error"}, status_code=500)
