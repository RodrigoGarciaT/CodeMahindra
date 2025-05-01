from sqlalchemy import Column, String, Integer, Date, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from database import Base

class Employee(Base):
    __tablename__ = "Employee"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    profileEpic = Column(String(255))
    nationality = Column(String(255))
    experience = Column(Integer)
    level = Column(Integer)
    firstName = Column(String(255))
    lastName = Column(String(255))
    birthDate = Column(Date)
    profilePicture = Column(String(255))
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    isAdmin = Column(Boolean, default=False)
    coins = Column(Integer, default=0)
    phoneNumber = Column(String(20))

    position_id = Column(Integer, ForeignKey("Position.id"))
    team_id = Column(Integer, ForeignKey("Team.id"))

    # Relaciones con Position y Team
    position = relationship("Position", back_populates="employees")
    team = relationship("Team", back_populates="employees")

    # Campos para autenticación con Jira
    jira_email = Column(String(255))
    jira_api_token = Column(String(255))