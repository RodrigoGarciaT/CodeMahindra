from sqlalchemy import Column, String, Integer, Date, DateTime, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from database import Base

class Employee(Base):
    __tablename__ = "Employee"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    profileEpic = Column(
        String(255),
        nullable=False,
        default='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkshh0IMgSA8yw_1JFALVsXFojVdR88C05Fw&s'
    )
    nationality = Column(String(255))
    experience = Column(Integer, default=0)
    level = Column(Integer, default=1)
    firstName = Column(String(255), nullable=False)
    lastName = Column(String(255), nullable=False)
    birthDate = Column(Date)
    profilePicture = Column(String, nullable=True)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    isAdmin = Column(Boolean, default=False)
    coins = Column(Integer, default=0)
    phoneNumber = Column(String(20), default="0000000000")
    position_id = Column(Integer, ForeignKey("Position.id"))
    team_id = Column(Integer, ForeignKey("Team.id"))

    # Relaciones
    position = relationship("Position", back_populates="employees")
    team = relationship("Team", back_populates="employees")
    xp_history = relationship("EmployeeXPHistory", back_populates="employee", cascade="all, delete")
    purchase_products = relationship("PurchaseProduct", back_populates="employee", cascade="all, delete")

    # 🔵 Campos Jira
    jira_email = Column(String(255), nullable=True)
    jira_api_token = Column(String(512), nullable=True)
    jira_account_id = Column(String(128), nullable=True)
    jira_last_sync = Column(DateTime, nullable=True)

    def get_jira_connection(self):
        """
        Retorna una instancia conectada a la API de Jira usando las credenciales del empleado.
        """
        if not self.jira_email or not self.jira_api_token:
            raise ValueError("Credenciales Jira no configuradas")
        
        from jira import JIRA
        return JIRA(
            server="https://cisneros101205.atlassian.net",
            basic_auth=(self.jira_email, self.jira_api_token)
        )