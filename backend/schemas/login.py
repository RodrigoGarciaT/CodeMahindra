from pydantic import BaseModel, EmailStr
from typing import Optional
from sqlalchemy import Column, String
from pydantic import BaseModel

class UserOut(BaseModel):
    first_name: str
    email: EmailStr

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class GoogleUser(BaseModel):
    email: str
    name: str
    google_id: str
    avatar: Optional[str] = None

class GoogleCredentialSchema(BaseModel):
    credential: str