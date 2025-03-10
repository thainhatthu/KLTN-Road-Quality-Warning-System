import os
from fastapi import UploadFile, HTTPException
from fastapi.responses import FileResponse
from schemas import User
from .format_response import format_response

class ProfileService:
    @staticmethod
    def edit_profile(user: User, username: str):
        if not isinstance(username, str):
            username = username.get("username") if isinstance(username, dict) else None
        if not username:
            return format_response(
                status="Error",
                message="Invalid token or unauthorized",
                status_code=401
            )

        user.username = username
        if not user.update_user_info():
            return format_response(
                status="Error",
                message="Failed to update profile",
                status_code=500
            )

        return format_response(
            status="Success",
            message="Profile updated successfully",
            status_code=200
        )
    
    @staticmethod
    def get_profile(username: str):
        if not isinstance(username, str):
            username = username.get("username") if isinstance(username, dict) else None
        if not username:
            return format_response(
                status="Error",
                message="Invalid token or unauthorized",
                status_code=401
            )

        user = User(username=username)
        info = user.get_profile()
        if not info:
            return format_response(
                status="Error",
                message="Profile not found",
                status_code=404
            )

        return format_response(
            status="Success",
            data=info,
            message="Profile retrieved successfully",
            status_code=200
        )

    @staticmethod
    def upload_avatar(username: str, file: UploadFile):
        if not isinstance(username, str):
            username = username.get("username") if isinstance(username, dict) else None
        if not username:
            raise HTTPException(status_code=401, detail="Invalid token or unauthorized")

        upload_folder = "avatar"
        os.makedirs(upload_folder, exist_ok=True)

        file_extension = file.filename.split(".")[-1]
        if file_extension.lower() not in ["jpg", "jpeg", "png"]:
            raise HTTPException(status_code=400, detail="Invalid file format")

        file_path = os.path.join(upload_folder, f"{username}.{file_extension}")

        with open(file_path, "wb") as f:
            f.write(file.file.read())

        user = User(username=username)
        if not user.update_avatar(file_path):
            raise HTTPException(status_code=500, detail="Failed to update avatar")

        return format_response(
            status="Success",
            message="Avatar uploaded successfully",
            status_code=200
        )
    
    @staticmethod
    def get_image_by_username(username: str):
        if not isinstance(username, str):
            raise HTTPException(status_code=401, detail="Invalid token or unauthorized")

        user = User(username=username)
        avatar_relative_path = user.get_avatar()

        if not avatar_relative_path:
            raise HTTPException(status_code=404, detail="Avatar not found in database")

        file_path = os.path.abspath(avatar_relative_path)

        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="Image file not found on server")

        return FileResponse(file_path)