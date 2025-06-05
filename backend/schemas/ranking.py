from pydantic import BaseModel
from uuid import UUID

class EmployeeRankingOut(BaseModel):
    id: UUID
    name: str
    avatar: str
    experience: int
    position: str
    team: str
    rank: int  # Posición en el ranking

    class Config:
        orm_mode = True  # Permite trabajar con objetos ORM

    # Ejemplo para la documentación de FastAPI
    class Config:
        schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "name": "John Doe",
                "avatar": "https://example.com/avatar.jpg",
                "experience": 1500,
                "position": "Software Engineer",
                "team": "Development",
                "rank": 1
            }
        }