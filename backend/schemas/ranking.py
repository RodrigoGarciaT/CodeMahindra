# backend/schemas/employee_ranking.py

from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class EmployeeRankingOut(BaseModel):
    id: UUID
    name: Optional[str]  # Usamos profileEpic por ahora
    avatar: Optional[str]  # Mapeado a profileEpic
    coins: int  # Mapeado a experience
    position: Optional[str]  # JOIN con Position.name
    team: Optional[str]  # JOIN con Team.name
    rank: int  # Calculado en el controller (enumerate)
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    nationality: Optional[str] = None

    class Config:
        orm_mode = True  # Compatible con tu proyecto actual