from pydantic import BaseModel, EmailStr, Field, SecretStr
from typing import Optional
from uuid import UUID
from datetime import date, datetime

class JiraCredentials(BaseModel):
    """Modelo dedicado solo para autenticación con Jira"""
    jira_email: EmailStr = Field(..., description="Email registrado en Jira")
    jira_api_token: SecretStr = Field(..., description="Token de API de Jira", min_length=20)

class EmployeeBase(BaseModel):
    profileEpic: Optional[str] = Field(
        default='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkshh0IMgSA8yw_1JFALVsXFojVdR88C05Fw&s',
        description="URL de imagen de perfil por defecto"
    )
    nationality: Optional[str] = Field(default="No especificado")
    experience: Optional[int] = Field(default=0, ge=0)
    level: Optional[int] = Field(default=1, ge=1)
    firstName: str = Field(default="Google User", min_length=1)
    lastName: str = Field(..., min_length=1)
    birthDate: Optional[date] = None
    profilePicture: Optional[str] = None
    email: EmailStr
    isAdmin: bool = Field(default=False)
    coins: int = Field(default=0, ge=0)
    phoneNumber: Optional[str] = Field(
        default="0000000000",
        pattern=r"^\d{6,15}$",  # ✅ Compatibilidad con Pydantic v2
        description="Número telefónico entre 6 y 15 dígitos"
    )
    position_id: Optional[int] = None
    team_id: Optional[int] = None

    # Campos Jira
    jira_email: Optional[EmailStr] = Field(
        None,
        description="Email de Jira (solo visible para el propio usuario y admins)"
    )
    jira_account_id: Optional[str] = Field(
        None,
        max_length=128,
        description="ID único de usuario en Jira (uso interno)"
    )
    jira_api_token: Optional[SecretStr] = Field(
        None,
        description="Token de API de Jira (uso interno, oculto en salidas)"
    )

class EmployeeCreate(EmployeeBase):
    password: str = Field(..., min_length=8, max_length=100)
    lastName: str = Field(..., min_length=1)
    email: EmailStr

class EmployeeUpdate(BaseModel):
    firstName: Optional[str]
    lastName: Optional[str]
    phoneNumber: Optional[str]
    nationality: Optional[str]
    profilePicture: Optional[str]
    birthDate: Optional[date] = None
    profileEpic: Optional[str] = None
    experience: Optional[int] = None
    level: Optional[int] = None
    position_id: Optional[int] = None
    team_id: Optional[int] = None
    jira_email: Optional[str] = None
    jira_api_token: Optional[str] = None

class EmployeeOut(EmployeeBase):
    id: UUID
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

    # Excluir token en salidas
    jira_api_token: Optional[SecretStr] = None

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat(),
            SecretStr: lambda v: "********" if v else None
        }

class AdminStatusUpdate(BaseModel):
    is_admin: bool

    class Config:
        from_attributes = True