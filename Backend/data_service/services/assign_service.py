from schemas import Task
from datetime import datetime
from .format_response import format_response
from fastapi import HTTPException, status
from Database import Postgresql
import threading
from .routemap_service import RouteMap

class AssignService:
    @staticmethod
    def assign_task_service(task: Task, user_info: dict):
        if user_info.get("role") != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action."
            )

        try:
            success, fullname, district_name, province_name = task.assign_task()

            if not success:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Task assignment failed due to invalid user or role."
                )

            if not district_name or not province_name:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="District or province information is missing."
                )

            if not task.deadline:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Deadline is missing."
                )

            formatted_deadline = task.deadline.strftime('%d-%m-%Y %H:%M:%S')

            return format_response(
                status="Success",
                data={
                    "username": task.username,
                    "fullname": fullname if fullname else "N/A",
                    "ward_name": task.ward_name,
                    "district_name": district_name,
                    "province_name": province_name,
                    "deadline": formatted_deadline
                },
                message="Task assigned successfully.",
                status_code=201
            )
        except HTTPException as e:
            return format_response(
                status="Error",
                data=None,
                message=e.detail,
                status_code=e.status_code
            )
        except Exception as e:
            return format_response(
                status="Error",
                data=None,
                message=f"An error occurred while assigning task: {e}",
                status_code=500
            )
        
    @staticmethod
    def update_status_service(user_info: dict, status: str, road_id: int = None, ward_id: int = None, report=None):
        role = user_info.get("role")
        username = user_info.get("username")

        if road_id and role not in ["admin", "technical"]:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to update road status"
            )

        if ward_id and role != "admin":
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to update assignment status"
            )

        try:
            task = Task(username=username)
            success = task.update_status(status, road_id, ward_id, report)

            if not success:
                raise HTTPException(
                    status_code=400,
                    detail="Failed to update status"
                )

            data = {
                "status": status,
                "updated_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            if ward_id:
                data.update({"ward_id": ward_id})
            if road_id:
                data.update({"road_id": road_id})
                db=Postgresql()
                ward_id = db.execute(f"SELECT ward_id FROM road WHERE id={road_id}")[0]
                db.close()
            print(ward_id)
            threading.Thread(target=RouteMap,args=([ward_id],)).start()

            return format_response(
                status="Success",
                data=data,
                message="Status updated successfully",
                status_code=200
            )
        except HTTPException as e:
            return format_response(
                status="Error",
                data=None,
                message=e.detail,
                status_code=e.status_code
            )
        except Exception as e:
            print(f"Error updating status: {e}")
            return format_response(
                status="Error",
                data=None,
                message="An error occurred while updating status",
                status_code=500
            )
        
    @staticmethod
    def get_task(user_info: dict, user_id: int = None):
        username = user_info.get("username")
        role = user_info.get("role")

        if role not in ["technical", "admin"]:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to access tasks"
            )

        try:
            task = Task(username=username)
            tasks = task.get_task(user_id=user_id, role=role)

            if not tasks:
                return format_response(
                    status="Success",
                    data=[],
                    message="No tasks found",
                    status_code=200
                )

            return format_response(
                status="Success",
                data=tasks,
                message="Tasks retrieved successfully",
                status_code=200
            )
        except HTTPException as e:
            return format_response(
                status="Error",
                data=None,
                message=e.detail,
                status_code=e.status_code
            )
        except Exception as e:
            print(f"Error getting tasks: {e}")
            return format_response(
                status="Error",
                data=None,
                message="An error occurred while retrieving tasks",
                status_code=500
            )
        
    @staticmethod
    def delete_task(user_info: dict, task_id: int):
        username = user_info.get("username")
        role = user_info.get("role")

        if role != "admin":
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to delete tasks"
            )

        try:
            task = Task(username=username)
            success = task.delete_task(task_id)

            if not success:
                raise HTTPException(
                    status_code=400,
                    detail="Failed to delete task"
                )

            return format_response(
                status="Success",
                data=None,
                message="Task deleted successfully",
                status_code=200
            )
        except HTTPException as e:
            return format_response(
                status="Error",
                data=None,
                message=e.detail,
                status_code=e.status_code
            )
        except Exception as e:
            print(e)
            return format_response(
                status="Error",
                data=None,
                message="An error occurred while deleting task",
                status_code=500
            )
    @staticmethod
    def get_report_task(user_info: dict, road_id: int = None):
        username = user_info.get("username")
        role = user_info.get("role")

        if role not in ["technical", "admin"]:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to access tasks"
            )

        try:
            task = Task(username=username)
            report_results = task.get_report_task(road_id=road_id)

            if not tasks:
                return format_response(
                    status="Success",
                    data=[],
                    message="No tasks found",
                    status_code=200
                )

            return format_response(
                status="Success",
                data=tasks,
                message="Get report task successfully",
                status_code=200
            )
        except HTTPException as e:
            return format_response(
                status="Error",
                data=None,
                message=e.detail,
                status_code=e.status_code
            )
        except Exception as e:
            print(f"Error getting tasks: {e}")
            return format_response(
                status="Error",
                data=None,
                message="An error occurred while retrieving tasks",
                status_code=500
            )