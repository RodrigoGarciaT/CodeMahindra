from sqlalchemy.orm import Session
from models.task import Task
from schemas.task import TaskCreate, TaskUpdate
from typing import List

# 🆕 Función auxiliar para extraer la descripción de Jira
def extract_description(fields: dict) -> str:
    description_data = fields.get("description")
    if not description_data:
        return ""
    if isinstance(description_data, dict):
        paragraphs = []
        for block in description_data.get("content", []):
            if block.get("type") == "paragraph":
                texts = [node.get("text", "") for node in block.get("content", []) if node.get("type") == "text"]
                paragraphs.append(" ".join(texts))
        return "\n\n".join(paragraphs).strip()
    elif isinstance(description_data, str):
        return description_data.strip()
    return ""

# 🔵 CRUD Functions

def get_all_tasks(db: Session):
    tasks = db.query(Task).all()
    return [
        {
            "id": task.id,
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
    new_task = Task(**task_data.dict())
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

def update_task(task_id: int, task_data: TaskUpdate, db: Session):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise Exception("Task not found")
    for key, value in task_data.dict(exclude_unset=True).items():
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

# 🆕 Función para crear un Task desde un issue de Jira
def create_task_from_jira(data: dict, db: Session):
    issue = data.get("issue", {})
    fields = issue.get("fields", {})

    title = fields.get("summary", "No title")
    task_type = fields.get("issuetype", {}).get("name")
    priority = fields.get("priority", {}).get("name")
    status = fields.get("status", {}).get("name")
    estimated_time = fields.get("timeoriginalestimate", 0)  # segundos
    tags = fields.get("labels", [])
    tags_str = ", ".join(tags)
    description = extract_description(fields)  # ✅ usamos la nueva función
    sprint_info = fields.get("customfield_10020", [])  # ⚠️ puede variar según tu Jira
    sprint = sprint_info[0]["name"] if sprint_info else None
    reporter = fields.get("reporter", {}).get("displayName", "")

    # 🆕 Info del asignado (assignee)
    assignee_name = fields.get("assignee", {}).get("displayName", None)
    assignee_avatar = fields.get("assignee", {}).get("avatarUrls", {}).get("48x48", None)

    new_task = Task(
        title=title,
        tasktype=task_type,
        priority=priority,
        status=status,
        estimatedtime=(estimated_time // 3600) if estimated_time else None,
        tag=tags_str,
        description=description,
        sprint=sprint,
        labels=tags_str,
        reporter=reporter,
        assignee_name=assignee_name,
        assignee_avatar=assignee_avatar,
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task