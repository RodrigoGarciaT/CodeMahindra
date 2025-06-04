# models/employee_achievement.py
from sqlalchemy import Column, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class EmployeeAchievement(Base):
    __tablename__ = "Employee_Achievement"

    employee_id = Column(
        UUID(as_uuid=True),
        ForeignKey("Employee.id", ondelete="CASCADE"),
        primary_key=True
    )
    achievement_id = Column(
        ForeignKey("Achievement.id", ondelete="CASCADE"),
        primary_key=True
    )
    obtainedDate = Column(DateTime, server_default=func.now(), nullable=False)

    # <-- AÑADE esta relación
    achievement = relationship("Achievement", back_populates="employee_achievements")