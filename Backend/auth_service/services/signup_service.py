from schemas import Account, Mail
from .format_response import format_response
import random
import threading


class SignupService:
    @staticmethod
    def signup_account(account: Account):
        def timeout_task(account: Account):
            if not account.checkActive():
                account.deleteAccount()
        if account.existenceUsername():
            return format_response("Error", message="Username already exists", status_code=400)
        if account.existenceEmail():
            return format_response("Error", message="Email already exists", status_code=400)
        OTP = random.randint(10000, 99999)
        mail = Mail()
        thread_send_otp = threading.Thread(target=mail.sendOTP, args=(account.email, OTP))
        thread_send_otp.start()
        if account.insertAccount(OTP):
            timer = threading.Timer(120, timeout_task, args=[account])
            timer.start()
            return format_response("Success", message="Enter OTP sent to your email to verify your account")
        return format_response("Error", message="Account creation failed", status_code=400)

    @staticmethod
    def verify_email(account: Account):
        if not account.existenceUsername():
            return format_response("Error", message="Username is not registered", status_code=400)
        if account.verifyEmail():
            return format_response("Success", message="Email verified successfully")
        return format_response("Error", message="Email verification failed", status_code=400)