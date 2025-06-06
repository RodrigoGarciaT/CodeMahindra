from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AchievementBase(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    key: str
    category: Optional[str] = None
    topic: Optional[str] = None
    criterion_type: str  # e.g., "count_solved", "static"
    threshold: int        # e.g., 100

class AchievementCreate(AchievementBase):
    pass

class AchievementUpdate(AchievementBase):
    pass

class AchievementOut(AchievementBase):
    id: int
    creationDate: datetime

    class Config:
        from_attributes = True