from jose import jwt
from fastapi import HTTPException
import os

def decode_access_token(token: str):
    try:
        secret_key = os.getenv("SECRET_KEY")
        if not secret_key:
            raise HTTPException(status_code=500, detail="JWT secret key not configured")
        payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")
