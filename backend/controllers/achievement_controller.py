from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.achievement import Achievement
from models.employee_achievement import EmployeeAchievement
from models.employee import Employee
from schemas.achievement import AchievementCreate, AchievementUpdate
from typing import List
from datetime import datetime
from uuid import UUID



# Reglas de asignación por experiencia (puedes mover esto a config)
ACHIEVEMENT_RULES = [
    {"min_exp": 100, "key": "start_100xp"},
    {"min_exp": 500, "key": "warrior_500xp"},
    {"min_exp": 1000, "key": "elite_1000xp"},
]

def get_all_achievements(db: Session) -> List[Achievement]:
    return db.query(Achievement).all()

def get_achievement_by_id(achievement_id: int, db: Session) -> Achievement:
    achievement = db.query(Achievement).filter(Achievement.id == achievement_id).first()
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    return achievement

def create_achievement(data: AchievementCreate, db: Session) -> Achievement:
    new_achievement = Achievement(**data.dict())
    db.add(new_achievement)
    db.commit()
    db.refresh(new_achievement)
    return new_achievement

def update_achievement(achievement_id: int, data: AchievementUpdate, db: Session) -> Achievement:
    achievement = db.query(Achievement).filter(Achievement.id == achievement_id).first()
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    for key, value in data.dict(exclude_unset=True).items():
        setattr(achievement, key, value)
    db.commit()
    db.refresh(achievement)
    return achievement

def delete_achievement(achievement_id: int, db: Session):
    achievement = db.query(Achievement).filter(Achievement.id == achievement_id).first()
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    db.delete(achievement)
    db.commit()

def evaluate_achievements_for_employee(employee_id: str, db: Session):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    earned = []

    # Obtener todos los logros con tipo "experience"
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
                earned.append(ach.key)

    db.commit()
    return {"earned_achievements": earned}

def get_achievement_status_for_employee(employee_id: UUID, db: Session):
    all_achievements = db.query(Achievement).all()
    earned_links = db.query(EmployeeAchievement).filter_by(employee_id=employee_id).all()
    
    earned_ids = {ea.achievement_id for ea in earned_links}
    
    earned = [a for a in all_achievements if a.id in earned_ids]
    unearned = [a for a in all_achievements if a.id not in earned_ids]

    return {
        "earned": earned,
        "unearned": unearned
    }