from sqlalchemy.orm import Session
from sqlalchemy import func, distinct
from datetime import datetime
from uuid import UUID

from models.employee import Employee
from models.solution import Solution
from models.achievement import Achievement
from models.employee_achievement import EmployeeAchievement

def check_and_award_achievements(db: Session, employee_id: UUID):
    """
    1) Cuenta cuántos problemas 'Accepted' (DISTINCT problem_id) tiene el usuario en solution.
    2) Lee la experiencia del usuario desde employee.experience.
    3) Revisa todos los registros en achievement (criterios + umbrales).
    4) Por cada achievement: si el usuario cumple y NO existe un EmployeeAchievement, lo inserta.
    5) Devuelve la lista de Achievement recién asignados (o [] si ninguno).
    """

    # 1) Contar problemas resueltos (status="Accepted"), sin duplicar problem_id
    total_solved = (
        db.query(func.count(distinct(Solution.problem_id)))
        .filter(
            Solution.employee_id == employee_id,
            Solution.status == "Accepted"
        )
        .scalar()
    ) or 0

    # 2) Obtener la experiencia actual del usuario
    user = db.query(Employee).filter(Employee.id == employee_id).first()
    if not user:
        return []

    exp_total = user.experience or 0

    # 3) Obtener todos los logros definidos en la tabla 'achievement'
    all_achievements = db.query(Achievement).all()

    nuevos_logros = []

    # 4) Para cada logro, si no lo tiene el usuario y cumple el umbral, lo inserta
    for ach in all_achievements:
        # 4.a) Verificar si el usuario ya tiene asignado este logro
        ya_tiene = (
            db.query(EmployeeAchievement)
            .filter_by(employee_id=employee_id, achievement_id=ach.id)
            .first()
        )
        if ya_tiene:
            continue

        # 4.b) Comparar métricas según el criterion_type
        if ach.criterion_type == "problems_solved":
            if total_solved >= ach.threshold:
                nuevo_link = EmployeeAchievement(
                    employee_id=employee_id,
                    achievement_id=ach.id,
                    awarded_at=datetime.utcnow()
                )
                db.add(nuevo_link)
                nuevos_logros.append(ach)

        elif ach.criterion_type == "experience":
            if exp_total >= ach.threshold:
                nuevo_link = EmployeeAchievement(
                    employee_id=employee_id,
                    achievement_id=ach.id,
                    awarded_at=datetime.utcnow()
                )
                db.add(nuevo_link)
                nuevos_logros.append(ach)

        # Si en el futuro se agregan otros tipos de criterio, añadir más elif aquí
        # ejemplo: elif ach.criterion_type == "bugs_fixed": ...

    # 5) Si hay nuevos logros, hacemos commit; si no, rollback
    if nuevos_logros:
        db.commit()
    else:
        db.rollback()

    return nuevos_logros