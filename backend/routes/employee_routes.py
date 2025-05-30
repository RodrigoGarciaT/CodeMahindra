from fastapi import APIRouter, Depends, HTTPException, Request, status
from typing import List, Optional
from sqlalchemy.orm import Session
from uuid import UUID
from pydantic import BaseModel, EmailStr, SecretStr, Field
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from datetime import datetime
import logging
import os
from dotenv import load_dotenv
from jira import JIRA, JIRAError

from database import get_db
from models.employee import Employee
from schemas.employee import AdminStatusUpdate, EmployeeCreate, EmployeeUpdate, EmployeeOut
from controllers.employee_controller import (
    get_all_employees,
    get_employee_by_id,
    create_employee,
    set_admin_status,
    update_employee,
    delete_employee,
)
from dependencies import get_current_employee

# Load env variables
load_dotenv()

router = APIRouter(prefix="/employees", tags=["Employees"])
logger = logging.getLogger(__name__)

JIRA_SERVER = os.getenv("JIRA_SERVER", "https://cisneros101205.atlassian.net")
JIRA_TIMEOUT = int(os.getenv("JIRA_TIMEOUT", "10"))


# ---------- 🔐 MODELOS ----------
class JiraCredentials(BaseModel):
    jira_email: EmailStr = Field(..., example="usuario@empresa.com")
    jira_api_token: SecretStr = Field(..., min_length=20, max_length=200)


class JiraAuthResponse(BaseModel):
    message: str
    jira_user: Optional[dict] = None
    sync_status: str
    sync_timestamp: str


# ---------- 🔐 AUTENTICACIÓN JIRA ----------
@router.put("/jira-auth", response_model=JiraAuthResponse)
async def update_jira_credentials(
    request: Request,
    credentials: JiraCredentials,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_employee),
):
    try:
        logger.info(f"🟡 Autenticando Jira para {current_user.email} desde {request.client.host}")
        email = credentials.jira_email.strip()
        token = credentials.jira_api_token.get_secret_value().strip()

        try:
            jira = JIRA(
                server=JIRA_SERVER,
                basic_auth=(email, token),
                timeout=JIRA_TIMEOUT,
            )
            jira_profile = jira.myself()
        except JIRAError as je:
            logger.error(f"❌ JiraAuth failed: {str(je)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Jira auth error: {je.text or 'Credenciales inválidas'}"
            )

        account_id = jira_profile.get("accountId")
        if not account_id:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="La cuenta de Jira no tiene un ID válido"
            )

        updated = False
        if current_user.jira_email != email:
            current_user.jira_email = email
            updated = True
        if current_user.jira_api_token != token:
            current_user.jira_api_token = token
            updated = True
        if current_user.jira_account_id != account_id:
            current_user.jira_account_id = account_id
            updated = True

        current_user.jira_last_sync = datetime.utcnow()

        if updated:
            db.commit()
            db.refresh(current_user)

        return {
            "message": "Credenciales validadas y almacenadas correctamente",
            "jira_user": {
                "account_id": account_id,
                "email": jira_profile.get("emailAddress"),
                "display_name": jira_profile.get("displayName"),
                "active": jira_profile.get("active"),
            },
            "sync_status": "success",
            "sync_timestamp": datetime.utcnow().isoformat()
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.critical(f"🔥 Error inesperado en jira-auth: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Error interno procesando credenciales Jira")


# ---------- CRUD EMPLOYEES (poner después) ----------
@router.get("/", response_model=List[EmployeeOut])
def list_employees(db: Session = Depends(get_db)):
    return get_all_employees(db)

@router.get("/{employee_id}", response_model=EmployeeOut)
def retrieve_employee(employee_id: UUID, db: Session = Depends(get_db)):
    return get_employee_by_id(employee_id, db)

@router.post("/", response_model=EmployeeOut, status_code=201)
def create_new_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    return create_employee(employee, db)

@router.put("/{employee_id}", response_model=EmployeeOut)
def update_existing_employee(employee_id: UUID, employee: EmployeeUpdate, db: Session = Depends(get_db)):
    return update_employee(employee_id, employee, db)

@router.delete("/{employee_id}", status_code=204)
def delete_existing_employee(employee_id: UUID, db: Session = Depends(get_db)):
    delete_employee(employee_id, db)
    return {"detail": "Employee deleted successfully"}

@router.patch("/{employee_id}/admin-status", response_model=EmployeeOut)
def update_admin_status(employee_id: UUID, status_update: AdminStatusUpdate, db: Session = Depends(get_db)):
    return set_admin_status(employee_id, status_update.is_admin, db)