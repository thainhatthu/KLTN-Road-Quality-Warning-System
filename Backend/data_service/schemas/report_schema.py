from pydantic import BaseModel

class ReportSchema(BaseModel):
    total_cost: float
    incidental_costs: float
    difficult: str = None
    propose: str = None
