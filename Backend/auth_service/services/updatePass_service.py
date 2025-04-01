from schemas import Account, Mail, ChangePassword
from .format_response import format_response
import random

class PasswordService:
    @staticmethod
    def forgot_password(account: Account):
        if not account.existenceEmail():
            return format_response("Error", message="Email does not exist", status_code=400)
        newPassword = ''.join(random.choices('abcdefghijklmnopqrstuvwxyz0123456789', k=8))
        account.updatePassword(newPassword)
        mail = Mail()
        mail.sendNewPass(account.email, newPassword)
        return format_response("Success", message="New password sent to your email")

    @staticmethod
    def change_password(request: ChangePassword, username: str):
        account = Account(username=username, password=request.current_password)
        if not account.checkAccount():
            return format_response("Error", message="Current password is incorrect", status_code=400)
        if request.new_password != request.confirm_password:
            return format_response("Error", message="New passwords do not match", status_code=400)
        request.changePassword(username, request.new_password)
        return format_response("Success", message="Password updated successfully")