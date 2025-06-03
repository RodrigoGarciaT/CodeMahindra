from datetime import datetime
from uuid import UUID
from pydantic import BaseModel
from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.employee import Employee
from models.employee_bot import EmployeeBot
from models.bot import Bot
from schemas.bot import BotCreate, BotUpdate
from typing import List

def get_all_bots(db: Session) -> List[Bot]:
    return db.query(Bot).all()

def get_bot_by_id(bot_id: int, db: Session) -> Bot:
    bot = db.query(Bot).filter(Bot.id == bot_id).first()
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    return bot

def create_bot(bot_data: BotCreate, db: Session) -> Bot:
    new_bot = Bot(**bot_data.dict())
    db.add(new_bot)
    db.commit()
    db.refresh(new_bot)
    return new_bot

def update_bot(bot_id: int, bot_data: BotUpdate, db: Session) -> Bot:
    bot = db.query(Bot).filter(Bot.id == bot_id).first()
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    for key, value in bot_data.dict().items():
        setattr(bot, key, value)
    db.commit()
    db.refresh(bot)
    return bot

def delete_bot(bot_id: int, db: Session):
    bot = db.query(Bot).filter(Bot.id == bot_id).first()
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    db.delete(bot)
    db.commit()



class BotPurchase(BaseModel):
    bot_id: int

def buy_bots(employee_id: UUID, bots_to_buy: List[BotPurchase], db: Session) -> List[Bot]:
    # Validate the bots_to_buy list
    if not bots_to_buy:
        raise HTTPException(status_code=400, detail="No bots provided for purchase")

    # Extract bot IDs from the input
    bot_ids = [item.bot_id for item in bots_to_buy]

    # Get all bots being purchased
    bots = (
        db.query(Bot)
        .filter(Bot.id.in_(bot_ids))
        .all()
    )

    # Map bot.id -> bot for quick lookup
    bot_map = {bot.id: bot for bot in bots}

    # Validate all bots exist
    if len(bot_map) != len(bot_ids):
        raise HTTPException(status_code=404, detail="One or more bots not found")

    # Calculate total cost
    total_cost = 0
    for bot_id in bot_ids:
        bot = bot_map[bot_id]
        total_cost += bot.price

    # Lock the employee's row for update to check coins balance
    employee = db.query(Employee).filter(Employee.id == employee_id).with_for_update().first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    if employee.coins < total_cost:
        raise HTTPException(status_code=400, detail="Insufficient coins to complete the purchase")

    # Deduct coins from the employee's account
    employee.coins -= total_cost

    # Create EmployeeBot relationships (all initially unequipped)
    for bot_id in bot_ids:
        # Check if employee already owns this bot
        existing_relationship = (
            db.query(EmployeeBot)
            .filter(EmployeeBot.employee_id == employee_id)
            .filter(EmployeeBot.bot_id == bot_id)
            .first()
        )
        
        if existing_relationship:
            raise HTTPException(
                status_code=400, 
                detail=f"Employee already owns bot ID {bot_id}"
            )

        # Create new relationship
        employee_bot = EmployeeBot(
            employee_id=employee_id,
            bot_id=bot_id,
            isEquipped=False,
            purchaseDate=datetime.utcnow()
        )
        db.add(employee_bot)

    db.commit()

    return list(bots)


class BotOut(BaseModel):
    id: int
    name: str
    description: str
    price: int
    image: str
    owns: bool = False
    isEquipped: bool = False

    class Config:
        orm_mode = True
        
def get_equipped_bot(employee_id: UUID, db: Session) -> Bot:
    equipped_bot = (
        db.query(Bot)
        .join(EmployeeBot, EmployeeBot.bot_id == Bot.id)
        .filter(EmployeeBot.employee_id == employee_id)
        .filter(EmployeeBot.isEquipped == True)
        .first()
    )
    
    if not equipped_bot:
        raise HTTPException(
            status_code=404, 
            detail="No bot currently equipped by this employee"
        )
    
    return equipped_bot