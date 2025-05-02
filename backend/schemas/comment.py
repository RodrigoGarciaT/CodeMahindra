from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class CommentBase(BaseModel):
    description: Optional[str] = None
    employee_id: UUID
    problem_id: int

class CommentCreate(CommentBase):
    pass

class CommentUpdate(BaseModel):
    description: Optional[str] = None

class CommentOut(CommentBase):
    id: int
    messageDate: datetime
    firstName: str
    lastName: str
    profilePicture: str

    class Config:
        from_attributes = True
