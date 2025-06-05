# backend/routers/task_router.py

from fastapi import APIRouter, Depends, HTTPException, Request
from typing import List
from sqlalchemy.orm import Session
import base64
import requests

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


# ----- CRUD de Tasks -----

@router.get("/", response_model=List[TaskOut])
def list_tasks(db: Session = Depends(get_db)):
    return get_all_tasks(db)

@router.get("/{task_id}", response_model=TaskOut)
def retrieve_task(task_id: int, db: Session = Depends(get_db)):
    try:
        return get_task_by_id(task_id, db)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/", response_model=TaskOut, status_code=201)
def create_new_task(task: TaskCreate, db: Session = Depends(get_db)):
    return create_task(task, db)

@router.put("/{task_id}", response_model=TaskOut)
def update_existing_task(task_id: int, task: TaskUpdate, db: Session = Depends(get_db)):
    try:
        return update_task(task_id, task, db)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/{task_id}", status_code=204)
def delete_existing_task(task_id: int, db: Session = Depends(get_db)):
    try:
        delete_task(task_id, db)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
    return


# ----- Integración con Jira -----

def get_jira_base_url(user: Employee) -> str:
    """
    Construye la URL base de la API de Jira a partir de user.jira_domain.
    """
    if not user.jira_domain:
        raise HTTPException(status_code=400, detail="Jira domain no configurado para este usuario.")
    domain = user.jira_domain.replace("https://", "").replace("http://", "")
    return f"https://{domain}/rest/api/3"


def get_jira_headers(user: Employee) -> dict:
    """
    Devuelve el header con Authorization Basic (email:api_token) para Jira.
    """
    if not user.jira_email or not user.jira_api_token:
        raise HTTPException(status_code=400, detail="Credenciales de Jira no encontradas para este usuario.")
    auth_str = f"{user.jira_email}:{user.jira_api_token}"
    auth_token = base64.b64encode(auth_str.encode("ascii")).decode("ascii")
    return {
        "Authorization": f"Basic {auth_token}",
        "Content-Type": "application/json"
    }


@router.get("/jira/issues")
def get_jira_issues(current_user: Employee = Depends(get_current_employee)):
    """
    Obtiene issues de Jira usando JQL estático (por ejemplo, proyecto = SCRUM).
    Se basa en las credenciales guardadas (email + api_token + domain).
    """
    base_url = get_jira_base_url(current_user)
    headers = get_jira_headers(current_user)
    params = {"jql": "project = SCRUM"}

    try:
        response = requests.get(f"{base_url}/search", headers=headers, params=params)
        response.raise_for_status()
        return response.json()
    except requests.HTTPError:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/jira/update")
def update_jira_issue(
    issue_id: str,
    transition_id: str,
    current_user: Employee = Depends(get_current_employee)
):
    """
    Actualiza el estado de un issue en Jira usando transition_id.
    """
    base_url = get_jira_base_url(current_user)
    headers = get_jira_headers(current_user)
    body = {"transition": {"id": transition_id}}

    try:
        url = f"{base_url}/issue/{issue_id}/transitions"
        response = requests.post(url, json=body, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.HTTPError:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/jira/sync", response_model=List[TaskOut], status_code=201)
def sync_jira_tasks(
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_employee)
):
    """
    Sincroniza tareas desde Jira a la tabla Task en la base de datos:
    1. Obtiene issues asignados al usuario actual (assignee = currentUser()).
    2. Para cada issue, invoca create_task_from_jira(...) SIN PASAR employee_id,
       de modo que las nuevas tareas se guarden con employee_id = NULL (evitando violaciones de FK).
    3. Devuelve una lista de TaskOut con las tareas creadas/actualizadas.
    """
    base_url = get_jira_base_url(current_user)
    headers = get_jira_headers(current_user)

    # JQL que trae issues asignados al currentUser() en Jira
    jql = "assignee = currentUser() ORDER BY updated DESC"
    params = {
        "jql": jql,
        "maxResults": 50,
        "fields": ",".join([
            "summary",
            "issuetype",
            "priority",
            "status",
            "timeoriginalestimate",
            "labels",
            "customfield_10020",  # Ajustar al ID real de tu campo Sprint
            "reporter",
            "assignee",
            "description",
        ])
    }

    try:
        response = requests.get(f"{base_url}/search", headers=headers, params=params)
        response.raise_for_status()
    except requests.HTTPError:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    issues_data = response.json().get("issues", [])
    tareas_creadas = []

    for issue in issues_data:
        payload = {"issue": issue}

        try:
            # — NO LE PASAMOS NINGÚN employee_id —
            tarea = create_task_from_jira(payload, db)
            tareas_creadas.append(tarea)
        except Exception as e:
            # Si falla con un issue (por ejemplo, FK), hacemos rollback y continuamos
            db.rollback()
            print(f"⚠️ Error procesando issue {issue.get('key')}: {e}")
            continue

    return tareas_creadas


@router.post("/jira/webhook", status_code=201)
async def jira_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Webhook para recibir eventos desde Jira (ej. issue_created, issue_updated).
    El payload debe contener "issue": { … } tal cual Jira envía.
    Como no sabemos a qué empleado interno asignar, simplemente llamamos sin employee_id.
    """
    data = await request.json()
    print("📩 Webhook de Jira recibido:", data)

    try:
        task = create_task_from_jira(data, db)  # <-- SIN employee_id
        return {"status": "created", "task_id": task.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))