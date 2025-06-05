from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID  # Importando UUID

class AchievementBase(BaseModel):
    name: str
    description: Optional[str] = None
    image: Optional[str] = None

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
    employee_id: UUID  # Reemplazado UUIDType por UUID
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