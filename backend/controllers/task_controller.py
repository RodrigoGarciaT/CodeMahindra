from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.task import Task
from schemas.task import TaskCreate, TaskUpdate
from typing import List

def get_all_tasks(db: Session) -> List[Task]:
    return db.query(Task).all()

def get_task_by_id(task_id: int, db: Session) -> Task:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

def create_task(data: TaskCreate, db: Session) -> Task:
    new_task = Task(**data.dict())
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

def update_task(task_id: int, data: TaskUpdate, db: Session) -> Task:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    for key, value in data.dict(exclude_unset=True).items():
        setattr(task, key, value)
    db.commit()
    db.refresh(task)
    return task

def delete_task(task_id: int, db: Session):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
