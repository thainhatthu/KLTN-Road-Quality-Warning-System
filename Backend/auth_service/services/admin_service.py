from schemas import AddUser, Account
from .format_response import format_response
from psycopg2.errors import UniqueViolation

def create_user_service(request: AddUser, current_user: str):
    try:
        account = Account(username=current_user)
        if account.getRole() != "admin":
            return format_response(
                status="Failed",
                data=None,
                message="Only admins can create new users",
                status_code=403
            )
        
        user_id = request.insert_user()
        if user_id:
            return format_response(
                status="Success",
                data={"username": request.username, "user_id": user_id},
                message="User created successfully",
                status_code=201
            )
        else:
            return format_response(
                status="Failed",
                data=None,
                message="Failed to create user",
                status_code=500
            )
    except UniqueViolation as uv: 
        print(f"Unique constraint error: {uv}")
        return format_response(
            status="Failed",
            data=None,
            message=f"User already exists",
            status_code=400
        )
    except Exception as e:
        print(f"Unexpected error: {e}")
        return format_response(
            status="Error",
            data=None,
            message="An error occurred during user creation",
            status_code=500
        )
    
def delete_user_service(username_to_delete: str, current_user: str):
    try:
        account = Account(username=current_user)
        if account.getRole() != "admin":
            return format_response(
                status="Failed",
                data=None,
                message="Only admins can delete users",
                status_code=403
            )
        
        account_to_delete = Account(username=username_to_delete)
        
        if not account_to_delete.existenceUsername():
            return format_response(
                status="Failed",
                data=None,
                message=f"User '{username_to_delete}' does not exist",
                status_code=404
            )
            
        account_to_delete.deleteAccount()

        return format_response(
            status="Success",
            data={"username": username_to_delete},
            message="User deleted successfully",
            status_code=200
        )
    except Exception as e:
        print(f"Unexpected error: {e}")
        return format_response(
            status="Error",
            data=None,
            message="An error occurred during user deletion",
            status_code=500
        )