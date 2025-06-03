from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from models.bot import Bot
from models.employee_bot import EmployeeBot
from models.employee import Employee
from database import get_db
from controllers.bot_controller import (
    BotPurchase,
    get_all_bots,
    get_bot_by_id,
    create_bot,
    update_bot,
    delete_bot,
    buy_bots,
    get_equipped_bot
)
from schemas.bot import BotCreate, BotUpdate, BotOut

router = APIRouter(prefix="/bots", tags=["Bots"])

@router.get("/", response_model=List[BotOut])
def list_bots(db: Session = Depends(get_db)):
    return get_all_bots(db)

@router.get("/{bot_id}", response_model=BotOut)
def retrieve_bot(bot_id: int, db: Session = Depends(get_db)):
    return get_bot_by_id(bot_id, db)

@router.post("/", response_model=BotOut, status_code=201)
def create_new_bot(bot: BotCreate, db: Session = Depends(get_db)):
    return create_bot(bot, db)

@router.put("/{bot_id}", response_model=BotOut)
def update_existing_bot(bot_id: int, bot: BotUpdate, db: Session = Depends(get_db)):
    return update_bot(bot_id, bot, db)

@router.delete("/{bot_id}", status_code=204)
def delete_existing_bot(bot_id: int, db: Session = Depends(get_db)):
    delete_bot(bot_id, db)


@router.post("/buy_bots", response_model=List[BotOut])
def purchase_bots(
    employee_id: UUID, 
    bots_to_buy: List[BotPurchase], 
    db: Session = Depends(get_db)
):
    # Verify employee exists first (without locking)
    if not db.query(Employee).filter(Employee.id == employee_id).first():
        raise HTTPException(status_code=404, detail="Employee not found")
    
    return buy_bots(employee_id, bots_to_buy, db)

class BotWithStatus(BotOut):
    owns: bool
    isEquipped: bool
    
    
@router.get("/employee/{employee_id}", response_model=List[BotWithStatus])
def list_bots_with_employee_status(
    employee_id: UUID,
    db: Session = Depends(get_db)
):
    """
    Get all bots with additional ownership and equipped status for a specific employee.
    """
    # Get all bots
    bots = db.query(Bot).all()
    
    # Get employee's bot relationships
    employee_bots = db.query(EmployeeBot).filter(EmployeeBot.employee_id == employee_id).all()
    employee_bot_map = {eb.bot_id: eb for eb in employee_bots}
    
    # Enhance bots with status information
    enhanced_bots = []
    for bot in bots:
        employee_bot = employee_bot_map.get(bot.id)
        enhanced_bots.append({
            **bot.__dict__,
            "owns": employee_bot is not None,
            "isEquipped": employee_bot.isEquipped if employee_bot else False
        })
    
    return enhanced_bots

@router.get("/employee/{employee_id}/equipped", response_model=BotOut)
def get_equipped_bot_for_employee(
    employee_id: UUID,
    db: Session = Depends(get_db)
):
    """
    Get the currently equipped bot for a specific employee.
    Returns 404 if no bot is currently equipped.
    """
    return get_equipped_bot(employee_id, db)