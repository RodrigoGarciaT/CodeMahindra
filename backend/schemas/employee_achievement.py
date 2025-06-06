from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional
from schemas.achievement import AchievementOut  # Importa el schema completo

class EmployeeAchievementBase(BaseModel):
    pass

class EmployeeAchievementCreate(EmployeeAchievementBase):
    employee_id: UUID
    achievement_id: int

class EmployeeAchievementOut(EmployeeAchievementBase):
    employee_id: UUID
    achievement_id: int
    obtainedDate: datetime
    achievement: Optional[AchievementOut]  # ← incluye detalle del logro

    class Config:
        from_attributes = True