from pydantic import BaseModel
from uuid import UUID
from typing import Optional, List    # <-- Se agregó List aquí
from datetime import datetime

# -------------------------------
# Esquemas originales de Solution
# -------------------------------

class SolutionBase(BaseModel):
    status: Optional[str] = None
    code: Optional[str] = None
    executionTime: Optional[float] = None
    memory: Optional[float] = None
    inTeam: Optional[bool] = None
    language: Optional[str] = None
    testCasesPassed: int = 0

class SolutionCreate(SolutionBase):
    employee_id: UUID
    problem_id: int

class SolutionUpdate(SolutionBase):
    pass

class SolutionOut(SolutionBase):
    id: int                # Nuevo campo para la salida
    employee_id: UUID
    problem_id: int
    submissionDate: datetime

class LeaderboardEntry(BaseModel):
    profilePicture: str
    firstName: str
    lastName: str
    testCasesPassed: int
    time: float

class Submission(BaseModel):
    employee_id: UUID
    problem_id: int
    source_code: str
    language: str  # puede ser "C++", "Javascript", "Python" o "Java"

    class Config:
        from_attributes = True

# ------------------------------------------------
# NUEVOS esquemas para la respuesta con nuevos logros
# ------------------------------------------------

class AchievementMini(BaseModel):
    """
    Representa un logro sencillo que el usuario acaba de obtener.
    """
    id: int
    key: str
    name: str
    description: Optional[str]
    category: str
    topic: str

    class Config:
        orm_mode = True

class ProblemSolvedResponse(BaseModel):
    """
    Esquema de respuesta tras enviar una solución de problema.
    Incluye status, experiencia actualizada y lista de logros nuevos.
    """
    message: str
    status: str            # "Accepted" o "Failed"
    experience: int
    new_achievements: List[AchievementMini] = []  # Lista de logros recién adquiridos (si los hubo)

    class Config:
        orm_mode = True