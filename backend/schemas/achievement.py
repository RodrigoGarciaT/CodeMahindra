# schemas/achievement.py

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from uuid import UUID as UUIDType

# -----------------------
# Esquema base de Achievement
# -----------------------
class AchievementBase(BaseModel):
    key: str
    name: str
    description: Optional[str] = None
    category: str
    topic: str
    icon: Optional[str] = None
    criterion_type: str    # e.g. "problems_solved" o "experience"
    threshold: int         # umbral para desbloquear

    model_config = {
        "from_attributes": True
    }


class AchievementCreate(AchievementBase):
    pass


class AchievementUpdate(AchievementBase):
    pass


# -----------------------
# Salida completa de un logro
# -----------------------
class AchievementOut(BaseModel):
    id: int
    key: str
    name: str
    description: Optional[str] = None
    category: str
    topic: str
    icon: Optional[str] = None
    criterion_type: str
    threshold: int

    model_config = {
        "from_attributes": True
    }


# -----------------------
# Salida para EmployeeAchievement (“logro ganado”)
# -----------------------
class EmployeeAchievementOut(BaseModel):
    employee_id: UUIDType      # <-- Ahora UUID en vez de str
    achievement_id: int
    obtainedDate: datetime
    achievement: AchievementOut

    model_config = {
        "from_attributes": True
    }


# -----------------------
# Respuesta para GET /achievements/me
# -----------------------
class UserAchievementsResponse(BaseModel):
    earned: List[EmployeeAchievementOut]
    not_earned: List[AchievementOut]

    model_config = {
        "from_attributes": True
    }