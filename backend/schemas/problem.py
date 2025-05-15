from uuid import UUID
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProblemBase(BaseModel):
    reward: Optional[int] = None
    name: str
    description: Optional[str] = None
    input_format: str
    output_format: str
    sample_input: str
    sample_output: str
    difficulty: Optional[str] = None
    acceptance: Optional[float] = None
    expirationDate: Optional[datetime] = None
    solution: Optional[str] = None
    language: str
    was_graded: bool = False

class ProblemCreate(ProblemBase):
    pass

class ProblemUpdate(ProblemBase):
    pass

class ProblemOut(ProblemBase):
    id: int
    creationDate: datetime

class ProblemGradingResult(BaseModel):
    message: str
    first_place: Optional[UUID] = None
    second_place: Optional[UUID] = None
    third_place: Optional[UUID] = None
    first_reward: Optional[int] = None
    second_reward: Optional[int] = None
    third_reward: Optional[int] = None
    class Config:
        from_attributes = True
