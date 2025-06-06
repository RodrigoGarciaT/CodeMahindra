from pydantic import BaseModel
from typing import List
from schemas.achievement import AchievementOut

class AchievementStatusResponse(BaseModel):
    earned: List[AchievementOut]
    unearned: List[AchievementOut]