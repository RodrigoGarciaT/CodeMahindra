# models/achievement.py
from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from database import Base

class Achievement(Base):
    __tablename__ = "Achievement"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(255), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(255), nullable=False)
    topic = Column(String(255), nullable=False)
    icon = Column(String(255), nullable=True)
    criterion_type = Column(String(50), nullable=False)
    threshold = Column(Integer, nullable=False)
    creationDate = Column(DateTime, server_default=func.now(), nullable=False)

    # <-- AÑADE esta relación
    employee_achievements = relationship("EmployeeAchievement", back_populates="achievement", cascade="all, delete-orphan")
