from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

class Position(Base):
    __tablename__ = "Position"  # Mayúscula inicial para ForeignKey en Employee

    id = Column(Integer, primary_key=True, index=True)
    positionName = Column(String(255), nullable=False)

    # Relación inversa con Employee
    employees = relationship("Employee", back_populates="position")