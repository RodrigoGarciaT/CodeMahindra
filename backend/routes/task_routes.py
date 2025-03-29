from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from database import get_db
from controllers.task_controller import (
    get_all_tasks,
    get_task_by_id,
    create_task,
    update_task,
    delete_task
)
from schemas.task import TaskCreate, TaskUpdate, TaskOut

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.get("/", response_model=List[TaskOut])
def list_tasks(db: Session = Depends(get_db)):
    return get_all_tasks(db)

@router.get("/{task_id}", response_model=TaskOut)
def retrieve_task(task_id: int, db: Session = Depends(get_db)):
    return get_task_by_id(task_id, db)

@router.post("/", response_model=TaskOut, status_code=201)
def create_new_task(data: TaskCreate, db: Session = Depends(get_db)):
    return create_task(data, db)

@router.put("/{task_id}", response_model=TaskOut)
def update_existing_task(task_id: int, data: TaskUpdate, db: Session = Depends(get_db)):
    return update_task(task_id, data, db)

@router.delete("/{task_id}", status_code=204)
def delete_existing_task(task_id: int, db: Session = Depends(get_db)):
    delete_task(task_id, db)
