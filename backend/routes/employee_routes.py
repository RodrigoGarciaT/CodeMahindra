from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session
from uuid import UUID
from pydantic import BaseModel, Field

from database import get_db

from controllers.employee_controller import (
    get_all_employees,
    get_employee_by_id,
    create_employee,
    set_admin_status,
    update_employee,
    delete_employee,
    get_difficulty_counts_by_employee
)
from schemas.employee import AdminStatusUpdate, EmployeeCreate, EmployeeUpdate, EmployeeOut
from dependencies import get_current_employee
from models.employee import Employee

router = APIRouter(prefix="/employees", tags=["Employees"])

# --- Jira Credentials Storage (moverlo antes de las rutas con /{employee_id}) ---

class JiraCredentials(BaseModel):
    jira_email:     str = Field(..., example="usuario@empresa.com")
    jira_api_token: str = Field(..., example="abcdef1234567890")
    jira_domain:    str = Field(..., example="midominio.atlassian.net")

@router.put(
    "/jira-auth",
    summary="Guardar credenciales de Jira",
    status_code=status.HTTP_204_NO_CONTENT
)
def update_jira_credentials(
    creds: JiraCredentials,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_employee),
):
    """
    Guarda o actualiza las credenciales de Jira (email, token y dominio)
    para el empleado autenticado.
    """
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    current_user.jira_email     = creds.jira_email
    current_user.jira_api_token = creds.jira_api_token
    current_user.jira_domain    = creds.jira_domain

    db.add(current_user)
    db.commit()
    return


# --- CRUD Endpoints ---

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
    return

@router.patch("/{employee_id}/admin-status", response_model=EmployeeOut)
def update_admin_status(employee_id: UUID, status_update: AdminStatusUpdate, db: Session = Depends(get_db)):
    return set_admin_status(employee_id, status_update.is_admin, db)

@router.get("/solved-difficulty/{employee_id}")
def get_solved_difficulty(employee_id: UUID, db: Session = Depends(get_db)):
    return get_difficulty_counts_by_employee(employee_id, db)
