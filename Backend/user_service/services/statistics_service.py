from schemas import User
from fastapi import HTTPException, status
from .format_response import format_response

class StatisticsService:
    @staticmethod
    def list_all_users(user_data: dict):
        username = user_data.get("username")
        role = user_data.get("role")

        if role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permission denied: Admin role required"
            )

        user = User(username=username)
        data = user.get_user_statistics()
        if not data:
            return format_response(
                status="Error",
                message="No user statistics found",
                status_code=404
            )
        return format_response(
            status="Success",
            data=data,
            message="User statistics retrieved successfully",
            status_code=200
        )

    @staticmethod
    def list_all_technicals(user_data: dict):
        username = user_data.get("username")
        role = user_data.get("role")

        if role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permission denied: Admin role required"
            )

        user = User(username=username)
        data = user.get_technical_statistics()
        if not data:
            return format_response(
                status="Error",
                message="No technical statistics found",
                status_code=404
            )
        return format_response(
            status="Success",
            data=data,
            message="Technical statistics retrieved successfully",
            status_code=200
        )
    
    @staticmethod
    def get_valid_wards(user_data: dict):
        username = user_data.get("username")
        role = user_data.get("role")

        if role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permission denied: Admin role required"
            )

        user = User(username=username)
        data = user.get_valid_wards()
        if not data:
            return format_response(
                status="Error",
                message="No valid ward found",
                status_code=404
            )
        return format_response(
            status="Success",
            data=data,
            message="Valid ward retrieved successfully",
            status_code=200
        )