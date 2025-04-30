from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from database import Base
from sqlalchemy.orm import relationship

class Comment(Base):
    __tablename__ = "Comment"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(Text)
    messageDate = Column(DateTime, server_default=func.now())
    employee_id = Column(UUID(as_uuid=True), ForeignKey("Employee.id", ondelete="CASCADE"))
    problem_id = Column(Integer, ForeignKey("Problem.id", ondelete="CASCADE"))

    # relationships
    employee = relationship("Employee", backref="comments")