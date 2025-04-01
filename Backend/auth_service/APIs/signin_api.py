from main import app
from schemas.account_schemas import Account, Role
from services.signin_service import signin_service, authorization_service
from fastapi import Depends
from JWT import Authentication

@app.post('/api/signin')
async def signin(request: Account):
    return signin_service(request)

@app.get('/api/authorization')
async def authorization(username=Depends(Authentication().validate_token)):
    return authorization_service(username)