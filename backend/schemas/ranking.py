from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class EmployeeRankingOut(BaseModel):
    id: UUID
    name: str
    avatar: Optional[str]
    coins: int
    position: Optional[str]
    team: Optional[str]
    rank: int  

    class Config:
        from_attributes = True