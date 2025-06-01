# controllers/task_controller.py

from sqlalchemy.orm import Session
from models.task import Task
from models.employee import Employee as EmployeeModel  # <-- lo importamos para validar existencia
from schemas.task import TaskCreate, TaskUpdate
from typing import List

def extract_description(fields: dict) -> str:
    # … tu misma implementación actual …
    description_data = fields.get("description")
    if not description_data:
        return ""
    if isinstance(description_data, dict):
        paragraphs = []
        for block in description_data.get("content", []):
            if block.get("type") == "paragraph":
                texts = [
                    node.get("text", "")
                    for node in block.get("content", [])
                    if node.get("type") == "text"
                ]
                paragraphs.append(" ".join(texts))
        return "\n\n".join(paragraphs).strip()
    elif isinstance(description_data, str):
        return description_data.strip()
    return ""

# CRUD Functions (no cambian)

def get_all_tasks(db: Session):
    tasks = db.query(Task).all()
    return [
        {
            "id": task.id,
            "jira_issue_key": task.jira_issue_key,
            "title": task.title,
            "taskType": task.tasktype,
            "priority": task.priority,
            "status": task.status,
            "estimatedTime": task.estimatedtime,
            "affectedModule": task.affectedmodule,
            "tag": task.tag,
            "reward": task.reward,
            "employee_id": task.employee_id,
            "createdAt": task.created_at.isoformat() if task.created_at else None,
            "description": task.description,
            "sprint": task.sprint,
            "labels": task.labels,
            "reporter": task.reporter,
            "assignee_name": task.assignee_name,
            "assignee_avatar": task.assignee_avatar,
        }
        for task in tasks
    ]

def get_task_by_id(task_id: int, db: Session):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise Exception("Task not found")
    return task

def create_task(task_data: TaskCreate, db: Session):
    new_task = Task(**task_data.dict(by_alias=True))
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

def update_task(task_id: int, task_data: TaskUpdate, db: Session):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise Exception("Task not found")
    for key, value in task_data.dict(exclude_unset=True, by_alias=True).items():
        setattr(task, key, value)
    db.commit()
    db.refresh(task)
    return task

def delete_task(task_id: int, db: Session):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise Exception("Task not found")
    db.delete(task)
    db.commit()
    return

# ✳️ Función corregida para crear/actualizar un Task desde un issue de Jira
def create_task_from_jira(data: dict, db: Session, employee_id=None):
    """
    data: diccionario que contiene "issue" tal cual la API de Jira devuelve.
    employee_id: UUID del Employee que sincroniza (opcional). Si no existe en DB, se ignora.
    """
    issue  = data.get("issue", {})
    key    = issue.get("key")      # Ej. "PROY-123"
    fields = issue.get("fields", {})

    # — Extraer campos de fields (igual que antes) —
    title          = fields.get("summary", "No title")
    task_type      = fields.get("issuetype", {}).get("name")
    priority       = fields.get("priority", {}).get("name")
    status         = fields.get("status", {}).get("name")
    estimated_time = fields.get("timeoriginalestimate", 0)  # en segundos
    labels         = fields.get("labels", [])
    tags_str       = ", ".join(labels)
    description    = extract_description(fields)
    sprint_info    = fields.get("customfield_10020", [])     # Ajustar al ID real de tu campo Sprint
    sprint         = sprint_info[0]["name"] if sprint_info else None
    reporter       = fields.get("reporter", {}).get("displayName", "")

    assignee_name   = fields.get("assignee", {}).get("displayName", None)
    assignee_avatar = fields.get("assignee", {}).get("avatarUrls", {}).get("48x48", None)

    # — 1) Validar que employee_id exista en la tabla Employee — 
    #    Si no existe, simplemente forzamos employee_id = None
    if employee_id is not None:
        existe_emp = db.query(EmployeeModel).filter(EmployeeModel.id == employee_id).first()
        if not existe_emp:
            # Ese UUID no está en la tabla Employee → no lo guardamos como FK
            employee_id = None

    # — 2) Verificar si ya existe un Task con el mismo jira_issue_key —
    existing = None
    if key:
        existing = db.query(Task).filter(Task.jira_issue_key == key).first()

    if existing:
        # Si existe, únicamente actualizamos los campos (no tocamos el FK si ya estaba en null o igual)
        existing.title           = title
        existing.tasktype        = task_type
        existing.priority        = priority
        existing.status          = status
        existing.estimatedtime   = (estimated_time // 3600) if estimated_time else None
        existing.tag             = tags_str
        existing.description     = description
        existing.sprint          = sprint
        existing.labels          = tags_str
        existing.reporter        = reporter
        existing.assignee_name   = assignee_name
        existing.assignee_avatar = assignee_avatar

        # Solo reasigna employee_id si ese FK es válido (o si antes ya lo tenía)
        if employee_id is not None:
            existing.employee_id = employee_id

        db.commit()
        db.refresh(existing)
        return existing

    # — 3) Si no existía, creamos uno nuevo (pasando employee_id solo si era válido) —
    new_task = Task(
        jira_issue_key   = key,
        title            = title,
        tasktype         = task_type,
        priority         = priority,
        status           = status,
        estimatedtime    = (estimated_time // 3600) if estimated_time else None,
        tag              = tags_str,
        description      = description,
        sprint           = sprint,
        labels           = tags_str,
        reporter         = reporter,
        assignee_name    = assignee_name,
        assignee_avatar  = assignee_avatar,
        employee_id      = employee_id   # si 'employee_id' quedó en None, el INSERT usará NULL
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task