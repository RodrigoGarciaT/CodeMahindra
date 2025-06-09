from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from controllers.ranking_controller import get_employee_ranking
from schemas.ranking import EmployeeRankingOut
from typing import List, Optional
from routes.users import get_current_user
from models.employee import Employee
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/ranking",
    tags=["Ranking"]
)

@router.get("/", response_model=List[EmployeeRankingOut])
def list_ranking(db: Session = Depends(get_db)):
    """
    Obtener el ranking completo de empleados.
    No requiere autenticación.
    """
    try:
        return get_employee_ranking(db)
    except Exception as e:
        logger.error(f"Error obteniendo ranking completo: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor al obtener el ranking"
        )

@router.get("/me", response_model=EmployeeRankingOut)
def get_my_ranking(
    db: Session = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    """
    Obtener la posición del usuario actual en el ranking.
    Requiere autenticación.
    """
    try:
        logger.info(f"Obteniendo ranking para usuario: {current_user.id}")
        
        # Obtener todos los empleados con experiencia > 0, ordenados por experiencia
        employees = (
            db.query(Employee)
            .filter(Employee.experience > 0)
            .order_by(Employee.experience.desc())
            .all()
        )
        
        logger.info(f"Total de empleados en ranking: {len(employees)}")
        
        # Buscar al usuario actual en el ranking
        user_rank = None
        for index, emp in enumerate(employees):
            if emp.id == current_user.id:
                user_rank = index + 1
                logger.info(f"Usuario encontrado en posición: {user_rank}")
                
                return EmployeeRankingOut(
                    id=emp.id,
                    name=f"{emp.firstName} {emp.lastName}".strip() or emp.email,
                    profileEpic=emp.profilePicture,  # Cambiado a profileEpic
                    experience=emp.experience,
                    position=emp.position.name if emp.position else None,
                    team=emp.team.name if emp.team else None,
                    rank=user_rank,
                    firstName=emp.firstName,
                    lastName=emp.lastName,
                    nationality=emp.nationality
                )
        
        # Si el usuario no está en el ranking (experiencia <= 0)
        logger.info(f"Usuario no encontrado en ranking activo. Experiencia: {current_user.experience}")
        
        # En lugar de devolver 404, devolver al usuario con posición fuera del ranking
        total_ranked_users = len(employees)
        
        return EmployeeRankingOut(
            id=current_user.id,
            name=f"{current_user.firstName} {current_user.lastName}".strip() or current_user.email,
            profileEpic=current_user.profileEpic or current_user.profilePicture,  # Cambiado a profileEpic
            experience=current_user.experience,
            position=current_user.position.name if current_user.position else None,
            team=current_user.team.name if current_user.team else None,
            rank=total_ranked_users + 1,  # Posición después del último
            firstName=current_user.firstName,
            lastName=current_user.lastName,
            nationality=current_user.nationality
        )
        
    except HTTPException:
        # Re-lanzar errores HTTP específicos (como 401 Unauthorized)
        raise
    except Exception as e:
        logger.error(f"Error obteniendo ranking del usuario {current_user.id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor al obtener tu ranking"
        )