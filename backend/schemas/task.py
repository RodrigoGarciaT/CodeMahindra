from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime

class TaskBase(BaseModel):
    title: str
    taskType: Optional[str] = Field(None, alias="tasktype")
    priority: Optional[str] = None
    status: Optional[str] = None
    estimatedTime: Optional[int] = Field(None, alias="estimatedtime")
    affectedModule: Optional[str] = Field(None, alias="affectedmodule")
    tag: Optional[str] = None
    reward: Optional[int] = None
    employee_id: Optional[UUID] = None

    # 🆕 Nuevos campos de información adicional
    description: Optional[str] = None
    sprint: Optional[str] = None
    labels: Optional[str] = None
    reporter: Optional[str] = None
    assignee_name: Optional[str] = None
    assignee_avatar: Optional[str] = None

    # 🆕 Clave de issue de Jira
    jira_issue_key: Optional[str] = Field(None, alias="jira_issue_key")

    class Config:
        populate_by_name = True
        from_attributes = True

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    taskType: Optional[str] = Field(None, alias="tasktype")
    priority: Optional[str] = None
    status: Optional[str] = None
    estimatedTime: Optional[int] = Field(None, alias="estimatedtime")
    affectedModule: Optional[str] = Field(None, alias="affectedmodule")
    tag: Optional[str] = None
    reward: Optional[int] = None
    employee_id: Optional[UUID] = None

    # 🆕 También los campos nuevos aquí
    description: Optional[str] = None
    sprint: Optional[str] = None
    labels: Optional[str] = None
    reporter: Optional[str] = None
    assignee_name: Optional[str] = None
    assignee_avatar: Optional[str] = None

    # 🆕 Clave de issue de Jira (solo lectura/exposición)
    jira_issue_key: Optional[str] = Field(None, alias="jira_issue_key")

    class Config:
        populate_by_name = True
        from_attributes = True

class TaskOut(TaskBase):
    id: int
    createdAt: Optional[datetime] = Field(None, alias="created_at")

    class Config:
        from_attributes = True
        populate_by_name = True