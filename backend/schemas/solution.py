from pydantic import BaseModel
from uuid import UUID
from typing import Optional
from datetime import datetime

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
    id: int  # New field
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
    language: str # language va a ser o C++, Javascript, Python o Java
    class Config:
        from_attributes = True
