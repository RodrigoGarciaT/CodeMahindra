from sqlalchemy.orm import Session
from models.employee import Employee
from schemas.ranking import EmployeeRankingOut
from typing import List

def get_employee_ranking(db: Session) -> List[EmployeeRankingOut]:
    employees = (
        db.query(Employee)
        .filter(Employee.coins > 0)
        .order_by(Employee.coins.desc())
        .all()
    )

    return [
        EmployeeRankingOut(
            id=emp.id,
            name=f"{emp.firstName} {emp.lastName}",
            avatar=emp.profilePicture,
            coins=emp.coins,
            position=emp.position.positionName if emp.position else None,
            team=emp.team.name if emp.team else None,
            rank=index + 1  # 👈 Posición en el ranking
        )
        for index, emp in enumerate(employees)
    ]