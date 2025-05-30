# backend/dependencies.py

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from database import get_db
from models.employee import Employee
import os

# Esquema para obtener el token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Clave secreta y algoritmo de codificación
SECRET_KEY = os.getenv("SECRET_KEY", "mysecret")  # Usa tu clave real en producción
ALGORITHM = "HS256"

def get_current_employee(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email: str = payload.get("sub")
        if user_email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(Employee).filter(Employee.email == user_email).first()
    if user is None:
        raise credentials_exception
    return user