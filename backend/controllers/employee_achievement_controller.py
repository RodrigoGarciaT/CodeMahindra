from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.employee_achievement import EmployeeAchievement
from schemas.employee_achievement import EmployeeAchievementCreate
from typing import List
from uuid import UUID

def get_all_achievements_for_employee(employee_id: UUID, db: Session) -> List[EmployeeAchievement]:
    return db.query(EmployeeAchievement).filter(EmployeeAchievement.employee_id == employee_id).all()

def get_all_employee_achievements(db: Session) -> List[EmployeeAchievement]:
    return db.query(EmployeeAchievement).all()

def get_employee_achievement(employee_id: UUID, achievement_id: int, db: Session) -> EmployeeAchievement:
    link = db.query(EmployeeAchievement).filter(
        EmployeeAchievement.employee_id == employee_id,
        EmployeeAchievement.achievement_id == achievement_id
    ).first()
    
    if not link:
        raise HTTPException(status_code=404, detail="Employee-Achievement not found")
    
    return link

def create_employee_achievement(data: EmployeeAchievementCreate, db: Session) -> EmployeeAchievement:
    # Verificar si el logro ya está asignado usando exists()
    existing = db.query(EmployeeAchievement).filter(
        EmployeeAchievement.employee_id == data.employee_id,
        EmployeeAchievement.achievement_id == data.achievement_id
    ).count() > 0  # Usamos count() para verificar existencia sin cargar el objeto
    
    if existing:
        raise HTTPException(status_code=400, detail="Achievement already assigned")
    
    # Crear el vínculo Employee-Achievement
    link = EmployeeAchievement(**data.dict())
    db.add(link)
    db.commit()
    db.refresh(link)
    return link

def delete_employee_achievement(employee_id: UUID, achievement_id: int, db: Session):
    # Eliminar un vínculo entre empleado y logro
    link = db.query(EmployeeAchievement).filter(
        EmployeeAchievement.employee_id == employee_id,
        EmployeeAchievement.achievement_id == achievement_id
    ).first()
    
    if not link:
        raise HTTPException(status_code=404, detail="Employee-Achievement not found")
    
    db.delete(link)
    db.commit()