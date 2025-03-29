from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from datetime import date

class EmployeeBase(BaseModel):
    profileEpic: Optional[str]
    nationality: Optional[str]
    experience: Optional[int]
    level: Optional[int]
    firstName: Optional[str]
    lastName: Optional[str]
    birthDate: Optional[date]
    profilePicture: Optional[str]
    email: EmailStr
    isAdmin: Optional[bool] = False
    coins: Optional[int] = 0
    phoneNumber: Optional[str]
    position_id: Optional[int]
    team_id: Optional[int]

class EmployeeCreate(EmployeeBase):
    password: str

class EmployeeUpdate(EmployeeBase):
    password: Optional[str] = None

class EmployeeOut(EmployeeBase):
    id: UUID

    class Config:
        from_attributes = True
