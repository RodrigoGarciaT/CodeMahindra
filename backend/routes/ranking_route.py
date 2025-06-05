from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from controllers.ranking_controller import get_employee_ranking
from schemas.ranking import EmployeeRankingOut
from typing import List
import logging

# Configurar el log para registrar los errores
logger = logging.getLogger("uvicorn.error")
logger.setLevel(logging.INFO)

router = APIRouter(prefix="/ranking", tags=["Ranking"])

@router.get("/", response_model=List[EmployeeRankingOut])
def list_ranking(db: Session = Depends(get_db)):
    try:
        rankings = get_employee_ranking(db)
        if not rankings:  # Si no hay rankings, simplemente los devolvemos vacíos
            return []
        return rankings
    except Exception as e:
        logger.error(f"Error fetching rankings: {str(e)}")  # Registrar el error
        raise HTTPException(status_code=500, detail=f"An error occurred while fetching rankings: {str(e)}")