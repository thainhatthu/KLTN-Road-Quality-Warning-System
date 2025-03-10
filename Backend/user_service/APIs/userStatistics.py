from main import app
from fastapi import Depends, Query
from services.statistics_service import StatisticsService
from services.auth_validate import validate_token

@app.get('/api/getUserStatistics')
def get_user_statistics(user_data: dict = Depends(validate_token)):
    return StatisticsService.list_all_users(user_data)

@app.get('/api/getTechnicalStatistics')
def get_technical_statistics(user_data: dict = Depends(validate_token)):
    return StatisticsService.list_all_technicals(user_data)

@app.get('/api/getValidWard')
def get_valid_ward(user_data: dict = Depends(validate_token)):
    return StatisticsService.get_valid_wards(user_data)