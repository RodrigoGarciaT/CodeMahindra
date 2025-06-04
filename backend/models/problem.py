# backend/models/problem.py

from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Boolean, func
from sqlalchemy.orm import relationship
from database import Base

class Problem(Base):
    __tablename__ = "Problem"
    __table_args__ = {"quote": True}

    id = Column(Integer, primary_key=True, index=True)
    reward = Column(Integer)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    input_format = Column(Text, nullable=False)
    output_format = Column(Text, nullable=False)
    sample_input = Column(Text, nullable=False)
    sample_output = Column(Text, nullable=False)
    difficulty = Column(String(50))
    acceptance = Column(Float)
    creationDate = Column(DateTime, server_default=func.now())
    expirationDate = Column(DateTime)
    solution = Column(Text)
    language = Column(Text, nullable=False)
    was_graded = Column(Boolean, nullable=False, server_default='false')
    successful_submissions = Column(Integer, default=0)
    total_submissions = Column(Integer, default=0)

    employees = relationship("EmployeeProblem", back_populates="problem")