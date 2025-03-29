from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from database import Base

class Task(Base):
    __tablename__ = "Task"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    taskType = Column(String(255))
    priority = Column(String(50))
    status = Column(String(50))
    estimatedTime = Column(Integer)
    affectedModule = Column(String(255))
    tag = Column(String(255))
    reward = Column(Integer)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("Employee.id"))
