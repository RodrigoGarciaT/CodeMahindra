from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from controllers.ranking_controller import get_employee_ranking
from schemas.ranking import EmployeeRankingOut
from typing import List

router = APIRouter(prefix="/ranking", tags=["Ranking"])

@router.get("/", response_model=List[EmployeeRankingOut])
def list_ranking(db: Session = Depends(get_db)):
    return get_employee_ranking(db)