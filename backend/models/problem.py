from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Boolean, Computed
from sqlalchemy.sql import func
from database import Base
from sqlalchemy.orm import relationship

class Problem(Base):
    __tablename__ = "Problem"

    id = Column(Integer, primary_key=True, index=True)
    reward = Column(Integer)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    input_format = Column(Text, nullable=False)
    output_format = Column(Text, nullable=False)
    sample_input = Column(Text, nullable=False)
    sample_output = Column(Text, nullable=False)
    difficulty = Column(String(50))
    successful_submissions = Column(Integer, default=0)
    total_submissions = Column(Integer, default=0)
    acceptance = Column(Float, Computed(
        "CASE WHEN total_submissions = 0 THEN 0 ELSE CAST(successful_submissions AS FLOAT) / total_submissions END"
    ))
    creationDate = Column(DateTime, server_default=func.now())
    expirationDate = Column(DateTime)
    solution = Column(Text)
    language = Column(Text, nullable=False)
    was_graded = Column(Boolean, nullable=False, server_default='false')
    employees = relationship("EmployeeProblem", back_populates="problem")