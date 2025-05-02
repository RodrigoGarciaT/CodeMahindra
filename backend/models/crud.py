# backend/crud.py
from sqlalchemy.orm import Session
from models.employee import Employee
from models import User 
from sqlalchemy.exc import NoResultFound
from passlib.context import CryptContext
import models.employee
from schemas.login import GoogleUser
import schemas
import models
import schemas.login
import os
from google.oauth2 import id_token
from google.auth.transport import requests
from fastapi import HTTPException

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


GOOGLE_CLIENT_ID = os.getenv("VITE_GOOGLE_CLIENT_ID")
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_user_by_email(db: Session, email: str):
    try:
        return db.query(User).filter(User.email == email).one()
    except NoResultFound:
        return None

def verify_google_token(token: str):
    try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)

        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise HTTPException(status_code=400, detail="Token de Google inválido (issuer)")

        return {
            "email": idinfo["email"],
            "name": idinfo.get("name"),
            "picture": idinfo.get("picture"),
            "sub": idinfo["sub"],  # ID único del usuario
        }

    except ValueError:
        raise HTTPException(status_code=400, detail="Token de Google inválido")