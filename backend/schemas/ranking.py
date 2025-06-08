# backend/schemas/employee_ranking.py

from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class EmployeeRankingOut(BaseModel):
    id: UUID
    name: Optional[str]
    profileEpic: Optional[str]  # Ahora es profileEpic directamente
    experience: int
    position: Optional[str]
    team: Optional[str]
    rank: int
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    nationality: Optional[str] = None

    class Config:
        orm_mode = True
