from fastapi import APIRouter, HTTPException 
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from routes.auth import get_user_by_email
import os
from sqlalchemy.orm import Session
from database import get_db 
from models.employee import Employee
from schemas.employee import EmployeeOut

router = APIRouter()


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")  # puede que tengas que ajustar la ruta
SECRET_KEY = os.getenv("SECRET_KEY", "secret")  # asegúrate de tener esto configurado
ALGORITHM = "HS256"

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(status_code=401, detail="Token inválido o expirado")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = get_user_by_email(db, email)
    if user is None:
        raise credentials_exception
    return user


@router.get("/user/me")
def read_current_user(current_user: Employee = Depends(get_current_user)):
    print(current_user.__dict__) 
    return {
        "email": current_user.email,
        "firstName": current_user.firstName,
        "lastName": current_user.lastName,
        "phoneNumber": current_user.phoneNumber,
        "isAdmin": current_user.isAdmin,
        "coins": current_user.coins,
        "profilePicture": current_user.profilePicture
        
    }


