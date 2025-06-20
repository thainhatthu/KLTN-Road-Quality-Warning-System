import requests
from fastapi import HTTPException, status

API_AUTHORIZATION_URL = "http://192.168.120.179/auth/api/authorization"

def validate_token(token: str):
    headers = {"Authorization": f"Bearer {token}"}
    try:
        response = requests.get(API_AUTHORIZATION_URL, headers=headers)
        if response.status_code == 200:
            data = response.json().get("data", {})
            username = data.get("username")
            role = data.get("role")
            if not username or not role:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token data: username or role missing"
                )
            return {"username": username, "role": role}
        else:
            raise HTTPException(
                status_code=response.status_code, 
                detail=response.json().get("message", "Token validation failed")
            )
    except requests.RequestException as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Unable to connect to authorization service"
        )