from pydantic import BaseModel
from uuid import UUID

class EmployeeRankingOut(BaseModel):
    id: UUID  # Cambiar de string a UUID si el id es un UUID
    name: str
    avatar: str
    experience: int
    position: str
    team: str
    rank: int  # Posición en el ranking