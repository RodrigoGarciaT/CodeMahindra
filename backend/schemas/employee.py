from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from datetime import date

class EmployeeBase(BaseModel):
    profileEpic: Optional[str] = None
    nationality: Optional[str] = None
    experience: Optional[int] = None
    level: Optional[int] = None
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    birthDate: Optional[date] = None
    profilePicture: Optional[str] = None
    email: EmailStr
    isAdmin: Optional[bool] = False
    coins: Optional[int] = 0
    phoneNumber: Optional[str] = None
    position_id: Optional[int] = None
    team_id: Optional[int] = None

    # 🆕 Campos para autenticación con Jira
    jira_email: Optional[str] = None
    jira_api_token: Optional[str] = None

class EmployeeCreate(EmployeeBase):
    email: EmailStr
    password: str
    firstName: str = "Google User"
    lastName: str
    nationality: str = "No especificado"
    phoneNumber: str = "0000000000"
    profilePicture: Optional[str] = None

class EmployeeUpdate(EmployeeBase):
    password: Optional[str] = None

class EmployeeOut(EmployeeBase):
    id: UUID
    email: EmailStr
    firstName: str
    profilePicture: Optional[str] = None
    model_config = {
        "from_attributes": True
    }


class AdminStatusUpdate(BaseModel):
    is_admin: bool
    class Config:
        from_attributes = True

    @classmethod
    def from_orm(cls, obj):
        return cls.model_validate(obj)