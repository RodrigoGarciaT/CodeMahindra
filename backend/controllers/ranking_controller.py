from sqlalchemy.orm import Session
from models.employee import Employee
from schemas.ranking import EmployeeRankingOut
from typing import List

def get_profile_image(emp: Employee) -> str | None:
    return emp.profilePicture if emp.profilePicture else None

def get_employee_ranking(db: Session) -> List[EmployeeRankingOut]:
    employees = (
        db.query(Employee)
        .filter(Employee.experience > 0)
        .order_by(Employee.experience.desc())
        .all()
    )

    return [
        EmployeeRankingOut(
            id=emp.id,
            name=f"{emp.firstName} {emp.lastName}".strip() or emp.email,
            profileEpic=get_profile_image(emp),  # Usamos la función que te protege de basura
            experience=emp.experience,
            position=emp.position.name if emp.position else None,
            team=emp.team.name if emp.team else None,
            rank=index + 1,
            firstName=emp.firstName,
            lastName=emp.lastName,
            nationality=emp.nationality
        )
        for index, emp in enumerate(employees)
    ]