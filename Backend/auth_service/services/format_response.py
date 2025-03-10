from fastapi.responses import JSONResponse

def format_response(status: str, data=None, message=None, status_code=200):
    response_content = {
        "status": status,
        "data": data,
        "message": message
    }
    return JSONResponse(content=response_content, status_code=status_code)
