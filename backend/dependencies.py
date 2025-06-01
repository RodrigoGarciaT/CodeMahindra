# backend/dependencies.py

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from database import get_db
from models.employee import Employee
from uuid import UUID
import os

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

SECRET_KEY = os.getenv("SECRET_KEY", "mysecret")  # Usa aquí tu clave secreta real
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

    # 1) Decodificar el token y extraer el campo "sub"
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub: str | None = payload.get("sub")
        if sub is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # 2) Intentar interpretar "sub" como UUID para buscar por id
    user = None
    try:
        user_uuid = UUID(sub)
        user = db.query(Employee).filter(Employee.id == user_uuid).first()
    except ValueError:
        # sub no era un UUID válido; intento buscarlo como e-mail
        user = db.query(Employee).filter(Employee.email == sub).first()

    if user is None:
        # No existe ningún empleado con ese id ni con ese email
        raise credentials_exception

    return user