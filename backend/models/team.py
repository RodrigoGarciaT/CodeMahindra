from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from database import Base

class Team(Base):
    __tablename__ = "Team"  

    id = Column(Integer, primary_key=True, index=True)
    creationDate = Column(DateTime)
    terminationDate = Column(DateTime)
    experience = Column(Integer)
    level = Column(Integer)
    name = Column(String(255))

    # Relación inversa con Employee
    employees = relationship("Employee", back_populates="team")