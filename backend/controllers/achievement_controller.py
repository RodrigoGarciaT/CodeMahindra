from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from models.employee_achievement import EmployeeAchievement
from models.achievement import Achievement
from dependencies import get_db, get_current_employee
from schemas.achievement import (
    AchievementOut,
    EmployeeAchievementOut,
    UserAchievementsResponse
)

router = APIRouter(prefix="/achievements", tags=["Achievements"])

@router.get("/me", response_model=UserAchievementsResponse)
def get_my_achievements(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_employee),
):
    # 1) Obtener todos los EmployeeAchievement del usuario
    earned_links = (
        db.query(EmployeeAchievement)
          .filter(EmployeeAchievement.employee_id == current_user.id)
          .all()
    )
    # Convertir a Pydantic usando .from_orm()
    earned_out = [EmployeeAchievementOut.from_orm(link) for link in earned_links]

    # 2) Extraer los IDs ya ganados
    earned_ids = {link.achievement_id for link in earned_links}

    # 3) Traer todos los Achievement que NO estén en earned_ids
    remaining = (
        db.query(Achievement)
          .filter(~Achievement.id.in_(earned_ids))
          .all()
    )
    remaining_out = [AchievementOut.from_orm(a) for a in remaining]

    return {
        "earned": earned_out,
        "not_earned": remaining_out,
    }