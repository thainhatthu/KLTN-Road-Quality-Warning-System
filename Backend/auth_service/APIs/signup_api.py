from main import app
from schemas import Account
from services import SignupService

@app.post('/api/signup')
def signup(request: Account):
    return SignupService.signup_account(request)

@app.post('/api/verifyEmail')
def verifyEmail(request: Account):
    return SignupService.verify_email(request)