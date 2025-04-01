from main import app
from JWT import Authentication 
from fastapi import Depends
from schemas import Account, ChangePassword
from services import PasswordService
from pydantic import EmailStr

@app.post('/api/forgotPassword')
def forgotPassword(request: Account):
    return PasswordService.forgot_password(request)

@app.post('/api/changePassword')
def change_password(request: ChangePassword, username: str = Depends(Authentication().validate_token)):
    return PasswordService.change_password(request, username)