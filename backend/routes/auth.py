# backend/routers/auth_router.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from sqlalchemy.orm.exc import NoResultFound
from models.employee import Employee
from schemas.login import LoginRequest
from schemas.employee import EmployeeCreate, EmployeeOut
from database import get_db
from pydantic import BaseModel
from schemas.create_access_token import create_access_token 
import os
from fastapi.responses import JSONResponse
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

router = APIRouter()

class GoogleToken(BaseModel):
    credential: str

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_email(db: Session, email: str):
    try:
        return db.query(Employee).filter(Employee.email == email).one()
    except NoResultFound:
        return None

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_employee(db: Session, employee_create: EmployeeCreate) -> EmployeeOut:
    hashed_password = pwd_context.hash(employee_create.password)

    db_employee = Employee(
        email=employee_create.email,
        password=hashed_password,
        firstName=employee_create.firstName,
        lastName=employee_create.lastName,
        nationality=employee_create.nationality,
        phoneNumber=employee_create.phoneNumber,
        profilePicture=employee_create.profilePicture 
    )

    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)

    return EmployeeOut.model_validate(db_employee)

def verify_google_token(token: str) -> dict:
    try:
        VITE_GOOGLE_CLIENT_ID = os.getenv('VITE_GOOGLE_CLIENT_ID')
        if not VITE_GOOGLE_CLIENT_ID:
            raise HTTPException(status_code=500, detail="Google Client ID not configured")

        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), VITE_GOOGLE_CLIENT_ID)

        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise HTTPException(status_code=400, detail="Token de Google inválido (issuer)")

        return {
            "email": idinfo["email"],
            "name": idinfo.get("name"),
            "picture": idinfo.get("picture"),
            "sub": idinfo["sub"],
            "profile_picture": idinfo.get("picture"),
        }
    except ValueError:
        raise HTTPException(status_code=400, detail="Token de Google inválido")

@router.post("/register", response_model=EmployeeOut)
async def register_employee(
    employee: EmployeeCreate,
    db: Session = Depends(get_db)
):
    try:
        user = create_employee(db, employee)
        return user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
async def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    email = login_data.email
    password = login_data.password

    user = get_user_by_email(db, email)
    if user is None or not verify_password(password, user.password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Credenciales incorrectas")

    # — CORRECCIÓN: en "sub" debe ir user.id (UUID), no user.email —
    access_token = create_access_token(data={
        "sub": str(user.id),
        "firstName": user.firstName,
        "lastName": user.lastName,
        "email": user.email,
        "isAdmin": user.isAdmin,
        "coins": user.coins,
        "profilePicture": user.profilePicture,
        "position_id": user.position_id,
        "nationality": user.nationality,
        "phoneNumber": user.phoneNumber,
        "team_id": user.team_id
    })
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/test-token")
def test_token():
    # Solo para test; aquí ponemos un UUID de ejemplo
    token = create_access_token(data={"sub": "00000000-0000-0000-0000-000000000000"})
    return {"token": token}

@router.post("/google")
def google_auth(
    data: GoogleToken,
    db: Session = Depends(get_db)
):
    google_data = verify_google_token(data.credential)

    user = get_user_by_email(db, google_data["email"])
    if not user:
        # Si no existe, creamos uno nuevo con la info de Google
        full_name = google_data.get("name", "Google User")
        parts = full_name.strip().split()
        if len(parts) >= 3:
            first_name = " ".join(parts[:-2])
            last_name = " ".join(parts[-2:])
        elif len(parts) == 2:
            first_name = parts[0]
            last_name = parts[1]
        else:
            first_name = full_name
            last_name = "No especificado"

        new_user = EmployeeCreate(
            email=google_data["email"],
            password="google",  # Contraseña temporal que no se usa para iniciar sesión normal
            firstName=first_name,
            lastName=last_name,
            nationality="No especificado",
            phoneNumber="0000000000",
            profilePicture=google_data.get("profile_picture"),
        )
        # Este create_employee devuelve EmployeeOut,  
        # pero necesitamos la instancia real para obtener user.id
        created = create_employee(db, new_user)
        user = get_user_by_email(db, created.email)

    # — CORRECCIÓN: en "sub" debe ir user.id (UUID) —
    token = create_access_token(data={
        "sub": str(user.id),
        "firstName": user.firstName,
        "lastName": user.lastName,
        "phoneNumber": user.phoneNumber,
        "isAdmin": user.isAdmin,
        "coins": user.coins,
        "profilePicture": google_data.get("picture") or user.profilePicture,
        "position_id": user.position_id,
        "team_id": user.team_id
    })

    return JSONResponse(
        content={
            "access_token": token,
            "user": {
                "sub": str(user.id),
                "firstName": user.firstName,
                "lastName": user.lastName,
                "phoneNumber": user.phoneNumber,
                "isAdmin": user.isAdmin,
                "coins": user.coins,
                "profilePicture": google_data.get("picture") or user.profilePicture,
                "position_id": user.position_id,
                "team_id": user.team_id
            }
        }
    )