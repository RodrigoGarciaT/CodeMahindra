from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from database import Base

class Achievement(Base):
    __tablename__ = "Achievement"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    key = Column(String(50), nullable=False, unique=True)  # ← si vas a usar claves tipo "champ_stack"
    category = Column(String(100))
    topic = Column(String(100))
    criterion_type = Column(String(50))  # e.g., "count_solved"
    threshold = Column(Integer)
    creationDate = Column(DateTime, server_default=func.now())