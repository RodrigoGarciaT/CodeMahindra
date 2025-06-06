# routes/ranking_route.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from controllers.ranking_controller import get_employee_ranking
from schemas.ranking import EmployeeRankingOut
from typing import List
from routes.users import get_current_user
from models.employee import Employee

router = APIRouter(
    prefix="/ranking",
    tags=["Ranking"]
)

@router.get("/", response_model=List[EmployeeRankingOut])
def list_ranking(db: Session = Depends(get_db)):
    return get_employee_ranking(db)

@router.get("/me", response_model=EmployeeRankingOut)
def get_my_ranking(
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    employees = (
        db.query(Employee)
        .filter(Employee.experience > 0)
        .order_by(Employee.experience.desc())
        .all()
    )

    for index, emp in enumerate(employees):
        if emp.id == current_user.id:
            return EmployeeRankingOut(
                id=emp.id,
                name=f"{emp.firstName} {emp.lastName}".strip() or emp.email,
                avatar=emp.profilePicture or "/placeholder.svg",
                coins=emp.experience,
                position=emp.position.name if emp.position else None,
                team=emp.team.name if emp.team else None,
                rank=index + 1,
                firstName=emp.firstName,
                lastName=emp.lastName,
                nationality=emp.nationality
            )

    # Si el usuario no está en ranking → puedes elegir devolver un "sin ranking" en vez de 404
    raise HTTPException(status_code=404, detail="User not found in ranking")