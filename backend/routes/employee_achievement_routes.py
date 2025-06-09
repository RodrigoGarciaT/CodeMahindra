from fastapi import APIRouter, Depends, HTTPException
from typing import List
from uuid import UUID
from sqlalchemy.orm import Session
from database import get_db
from controllers.employee_achievement_controller import (
    get_all_employee_achievements,
    get_employee_achievement,
    create_employee_achievement,
    delete_employee_achievement,
    get_all_achievements_for_employee
)
from schemas.employee_achievement import EmployeeAchievementCreate, EmployeeAchievementOut
from models.employee import Employee
from models.achievement import Achievement

router = APIRouter(prefix="/employee-achievements", tags=["Employee-Achievements"])

# Función de ayuda para verificar si el empleado existe
def get_employee(employee_id: UUID, db: Session) -> Employee:
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

# Función de ayuda para verificar si el logro existe
def get_achievement(achievement_id: int, db: Session) -> Achievement:
    achievement = db.query(Achievement).filter(Achievement.id == achievement_id).first()
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    return achievement

@router.get("/", response_model=List[EmployeeAchievementOut])
def list_employee_achievements(db: Session = Depends(get_db)):
    return get_all_employee_achievements(db)

@router.get("/{employee_id}/{achievement_id}", response_model=EmployeeAchievementOut)
def retrieve_employee_achievement(employee_id: UUID, achievement_id: int, db: Session = Depends(get_db)):
    # Verificar si el empleado y el logro existen
    get_employee(employee_id, db)
    get_achievement(achievement_id, db)

    return get_employee_achievement(employee_id, achievement_id, db)

@router.post("/", response_model=EmployeeAchievementOut, status_code=201)
def create_employee_achievement_link(data: EmployeeAchievementCreate, db: Session = Depends(get_db)):
    # Verificar si el empleado y el logro existen
    get_employee(data.employee_id, db)
    get_achievement(data.achievement_id, db)

    return create_employee_achievement(data, db)

@router.delete("/{employee_id}/{achievement_id}", status_code=204)
def delete_employee_achievement_link(employee_id: UUID, achievement_id: int, db: Session = Depends(get_db)):
    # Verificar si el empleado y el logro existen
    get_employee(employee_id, db)
    get_achievement(achievement_id, db)

    delete_employee_achievement(employee_id, achievement_id, db)

@router.get("/{employee_id}", response_model=List[EmployeeAchievementOut])
def list_achievements_for_employee(employee_id: UUID, db: Session = Depends(get_db)):
    # Verificar si el empleado existe
    get_employee(employee_id, db)

    return get_all_achievements_for_employee(employee_id, db)