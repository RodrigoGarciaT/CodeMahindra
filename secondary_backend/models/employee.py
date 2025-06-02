from sqlalchemy import Column, String, Boolean, Integer, Date, Text
from sqlalchemy.dialects.postgresql import UUID
import uuid
from database import Base

class Employee(Base):
    __tablename__ = "Employee"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profileEpic = Column(String(255), default="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkshh0IMgSA8yw_1JFALVsXFojVdR88C05Fw&s", nullable=False)
    nationality = Column(String(255))
    experience = Column(Integer)
    level = Column(Integer)
    firstName = Column(String(255))
    lastName = Column(String(255))
    birthDate = Column(Date)
    profilePicture = Column(Text, default="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkshh0IMgSA8yw_1JFALVsXFojVdR88C05Fw&s")
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    isAdmin = Column(Boolean, default=False)
    coins = Column(Integer)
    phoneNumber = Column(String(20))
    position_id = Column(Integer)
    team_id = Column(Integer)
    hashed_password = Column(Text)
    jira_email = Column(String(255))
    jira_api_token = Column(String(255))
    jira_account_id = Column(String(128))
    jira_last_sync = Column(Date)
    jira_domain = Column(String(255))
    github_username = Column(String)
    github_token = Column(Text)
