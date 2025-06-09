from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.achievement import Achievement
from models.employee_achievement import EmployeeAchievement
from models.employee import Employee
from datetime import datetime
from typing import List
from uuid import UUID
from schemas.achievement import AchievementCreate, AchievementUpdate
from schemas.employee_achievement import EmployeeAchievementCreate


# Función para evaluar y asignar logros basada en la experiencia
def evaluate_achievements_for_employee(employee_id: UUID, db: Session):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    earned = []  # Lista de logros ganados
    achievements = db.query(Achievement).filter(Achievement.criterion_type == "experience").all()

    for ach in achievements:
        if employee.experience >= ach.threshold:
            already_earned = db.query(EmployeeAchievement).filter_by(
                employee_id=employee_id,
                achievement_id=ach.id
            ).first()

            if not already_earned:
                new_achievement = EmployeeAchievement(
                    employee_id=employee_id,
                    achievement_id=ach.id,
                    obtainedDate=datetime.utcnow()
                )
                db.add(new_achievement)
                earned.append(ach.key)  # Agregar la clave del logro a la lista de logros ganados

    db.commit()
    return {"earned_achievements": earned}

# Función para obtener todos los logros
def get_all_achievements(db: Session) -> List[Achievement]:
    return db.query(Achievement).all()

# Función para obtener un logro por su ID
def get_achievement_by_id(achievement_id: int, db: Session) -> Achievement:
    achievement = db.query(Achievement).filter(Achievement.id == achievement_id).first()
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    return achievement

# Función para crear un nuevo logro
def create_achievement(data: AchievementCreate, db: Session) -> Achievement:
    new_achievement = Achievement(**data.dict())
    db.add(new_achievement)
    db.commit()
    db.refresh(new_achievement)
    return new_achievement

# Función para actualizar un logro existente
def update_achievement(achievement_id: int, data: AchievementUpdate, db: Session) -> Achievement:
    achievement = db.query(Achievement).filter(Achievement.id == achievement_id).first()
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    for key, value in data.dict(exclude_unset=True).items():
        setattr(achievement, key, value)
    db.commit()
    db.refresh(achievement)
    return achievement

# Función para eliminar un logro
def delete_achievement(achievement_id: int, db: Session):
    achievement = db.query(Achievement).filter(Achievement.id == achievement_id).first()
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    db.delete(achievement)
    db.commit()

# Función para obtener todos los logros asignados a un empleado
def get_all_achievements_for_employee(employee_id: UUID, db: Session) -> List[EmployeeAchievement]:
    return db.query(EmployeeAchievement).filter(EmployeeAchievement.employee_id == employee_id).all()

# Función para crear un nuevo logro asignado a un empleado
def create_employee_achievement(data: EmployeeAchievementCreate, db: Session) -> EmployeeAchievement:
    # Verificar si el empleado existe
    employee = db.query(Employee).filter(Employee.id == data.employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Asignar logros basados en la experiencia
    return evaluate_achievements_for_employee(data.employee_id, db)

# Función para eliminar un logro asignado a un empleado
def delete_employee_achievement(employee_id: UUID, achievement_id: int, db: Session):
    link = db.query(EmployeeAchievement).filter(
        EmployeeAchievement.employee_id == employee_id,
        EmployeeAchievement.achievement_id == achievement_id
    ).first()
    if not link:
        raise HTTPException(status_code=404, detail="Employee-Achievement not found")
    db.delete(link)
    db.commit()

# Función para obtener el estado de los logros de un empleado
def get_achievement_status_for_employee(employee_id: UUID, db: Session):
    # Obtener todos los logros
    all_achievements = db.query(Achievement).all()
    # Obtener los logros asignados al empleado
    earned_links = db.query(EmployeeAchievement).filter_by(employee_id=employee_id).all()

    # Crear un set con los IDs de los logros asignados
    earned_ids = {ea.achievement_id for ea in earned_links}

    # Filtrar los logros ganados y no ganados
    earned = db.query(Achievement).filter(Achievement.id.in_(earned_ids)).all()
    unearned = db.query(Achievement).filter(~Achievement.id.in_(earned_ids)).all()

    return {
        "earned": earned,
        "unearned": unearned
    }