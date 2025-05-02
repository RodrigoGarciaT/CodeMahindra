from sqlalchemy import Column, ForeignKey, String, Text, Float, Boolean, DateTime, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from database import Base
from sqlalchemy.orm import relationship  # Add this import

class Solution(Base):
    __tablename__ = "Solution"

    # New auto-incrementing primary key
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Changed from primary_key=True to regular columns
    employee_id = Column(
        UUID(as_uuid=True),
        ForeignKey("Employee.id", ondelete="CASCADE"),
        nullable=False
    )
    problem_id = Column(
        ForeignKey("Problem.id", ondelete="CASCADE"),
        nullable=False
    )
    
    # All existing columns remain unchanged
    submissionDate = Column(DateTime, server_default=func.now())
    status = Column(String(50))
    code = Column(Text)
    executionTime = Column(Float)
    memory = Column(Float)
    inTeam = Column(Boolean)
    language = Column(String(50))
    testCasesPassed = Column(Integer, nullable=False, server_default="0")
 