from sqlalchemy.orm import Session
from models.employee import Employee
from schemas.ranking import EmployeeRankingOut
from typing import List

def get_employee_ranking(db: Session) -> List[EmployeeRankingOut]:
    # Modificación para ordenar por experiencia (experience) en lugar de monedas (coins)
    employees = (
        db.query(Employee)
        .filter(Employee.experience > 0)  # Filtramos solo aquellos con experiencia
        .order_by(Employee.experience.desc())  # Ahora ordenamos por experiencia
        .all()
    )

    return [
        EmployeeRankingOut(
            id=emp.id,
            name=f"{emp.firstName} {emp.lastName}",
            avatar=emp.profilePicture,
            experience=emp.experience,  # Usamos experiencia en lugar de monedas
            position=emp.position.positionName if emp.position else "Unknown",  # Valor por defecto si no existe
            team=emp.team.name if emp.team else "Unassigned",  # Valor por defecto si no existe
            rank=index + 1  # 👈 Posición en el ranking
        )
        for index, emp in enumerate(employees)
    ]