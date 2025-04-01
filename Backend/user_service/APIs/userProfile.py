from main import app
from fastapi import Depends, File, UploadFile, Query
from schemas.user_schemas import User
from services.profile_service import ProfileService
from services.auth_validate import validate_token

@app.post('/api/editProfile')
def edit_profile(data: User, username: str = Depends(validate_token)):
    return ProfileService.edit_profile(data, username)

@app.get('/api/getProfile')
def get_profile(username: str = Depends(validate_token)):
    return ProfileService.get_profile(username)

@app.post('/api/uploadAvatar')
def upload_avatar(file: UploadFile = File(...), username: str = Depends(validate_token)):
    return ProfileService.upload_avatar(username, file)

@app.get("/api/getAvatar")
def get_image(uusername: str = Query(..., alias="username")):
    return ProfileService.get_image_by_username(uusername)