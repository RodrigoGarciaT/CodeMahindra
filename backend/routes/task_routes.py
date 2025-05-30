from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List
import base64
import requests
import logging

from database import get_db
from schemas.task import TaskCreate, TaskUpdate, TaskOut
from controllers.task_controller import (
    get_all_tasks,
    get_task_by_id,
    create_task,
    update_task,
    delete_task,
    create_task_from_jira,
)
from models.employee import Employee
from dependencies import get_current_employee

router = APIRouter(prefix="/tasks", tags=["Tasks"])

# ----- CRUD local de Tasks -----

@router.get("/", response_model=List[TaskOut])
def list_tasks(
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_employee)
):
    return get_all_tasks(db, employee_id=current_user.id)

@router.get("/{task_id}", response_model=TaskOut)
def retrieve_task(task_id: int, db: Session = Depends(get_db)):
    task = get_task_by_id(task_id, db)
    return task

@router.post("/", response_model=TaskOut, status_code=201)
def create_new_task(task: TaskCreate, db: Session = Depends(get_db)):
    return create_task(task, db)

@router.put("/{task_id}", response_model=TaskOut)
def update_existing_task(task_id: int, task: TaskUpdate, db: Session = Depends(get_db)):
    return update_task(task_id, task, db)

@router.delete("/{task_id}", status_code=204)
def delete_existing_task(task_id: int, db: Session = Depends(get_db)):
    delete_task(task_id, db)
    return {"detail": "Task deleted successfully"}

# ----- Integración con Jira -----

JIRA_BASE_URL = "https://your-domain.atlassian.net/rest/api/3"

def get_jira_headers(user: Employee):
    if not user.jira_email or not user.jira_api_token:
        raise HTTPException(status_code=400, detail="Jira credentials not configured.")

    auth_str = f"{user.jira_email}:{user.jira_api_token}"
    auth_token = base64.b64encode(auth_str.encode("ascii")).decode("ascii")
    return {
        "Authorization": f"Basic {auth_token}",
        "Content-Type": "application/json"
    }

@router.get("/jira/issues")
def get_jira_issues(current_user: Employee = Depends(get_current_employee)):
    headers = get_jira_headers(current_user)
    jql_query = "assignee = currentUser() ORDER BY created DESC"
    params = {"jql": jql_query}

    try:
        response = requests.get(f"{JIRA_BASE_URL}/search", headers=headers, params=params)
        if not response.ok:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.json().get("errorMessages", ["Error fetching issues from Jira"])
            )
        return response.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/jira/import")
def import_jira_issues_to_db(
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_employee)
):
    """
    Importa todos los issues asignados al usuario desde Jira y los guarda como tareas locales.
    """
    headers = get_jira_headers(current_user)
    params = {"jql": "assignee = currentUser() ORDER BY created DESC"}

    try:
        response = requests.get(f"{JIRA_BASE_URL}/search", headers=headers, params=params)
        if not response.ok:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.json().get("errorMessages", ["Error fetching issues from Jira"])
            )

        issues = response.json().get("issues", [])
        imported = []

        for issue in issues:
            try:
                payload = {"issue": issue}
                task = create_task_from_jira(payload, db, employee_id=current_user.id)
                imported.append({"task_id": task.id, "title": task.title})
            except Exception as e:
                logging.warning(f"Error al importar issue {issue.get('key')}: {e}")
                continue

        return {
            "imported_count": len(imported),
            "imported_tasks": imported
        }

    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/jira/webhook")
async def jira_webhook(
    request: Request,
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_employee)
):
    """
    Webhook para recibir eventos desde Jira (ej. creación de issue).
    """
    data = await request.json()
    print("📩 Webhook recibido de Jira:", data)

    try:
        task = create_task_from_jira(data, db, employee_id=current_user.id)
        return {"status": "created", "task_id": task.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating task from Jira: {str(e)}")