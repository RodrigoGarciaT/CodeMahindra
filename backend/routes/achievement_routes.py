from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from database import get_db
from uuid import UUID
from schemas.achievement_status import AchievementStatusResponse
from controllers.achievement_controller import get_achievement_status_for_employee
from controllers.achievement_controller import (
    get_all_achievements,
    get_achievement_by_id,
    create_achievement,
    update_achievement,
    delete_achievement,
    evaluate_achievements_for_employee  # 🆕 nueva función
)
from schemas.achievement import AchievementCreate, AchievementUpdate, AchievementOut

router = APIRouter(prefix="/achievements", tags=["Achievements"])

@router.get("/", response_model=List[AchievementOut])
def list_achievements(db: Session = Depends(get_db)):
    return get_all_achievements(db)

@router.get("/{achievement_id}", response_model=AchievementOut)
def retrieve_achievement(achievement_id: int, db: Session = Depends(get_db)):
    return get_achievement_by_id(achievement_id, db)

@router.post("/", response_model=AchievementOut, status_code=201)
def create_new_achievement(data: AchievementCreate, db: Session = Depends(get_db)):
    return create_achievement(data, db)

@router.put("/{achievement_id}", response_model=AchievementOut)
def update_existing_achievement(achievement_id: int, data: AchievementUpdate, db: Session = Depends(get_db)):
    return update_achievement(achievement_id, data, db)

@router.delete("/{achievement_id}", status_code=204)
def delete_existing_achievement(achievement_id: int, db: Session = Depends(get_db)):
    delete_achievement(achievement_id, db)

# 🆕 Nuevo endpoint para evaluación de logros
@router.post("/evaluate/{employee_id}")
def evaluate_achievements(employee_id: str, db: Session = Depends(get_db)):
    return evaluate_achievements_for_employee(employee_id, db)


@router.get("/status/{employee_id}", response_model=AchievementStatusResponse)
def get_status(employee_id: UUID, db: Session = Depends(get_db)):
    return get_achievement_status_for_employee(employee_id, db)