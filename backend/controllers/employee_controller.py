from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.employee import Employee
from schemas.employee import EmployeeCreate, EmployeeUpdate
from typing import List
from uuid import UUID

def get_all_employees(db: Session) -> List[Employee]:
    return db.query(Employee).all()

def get_employee_by_id(employee_id: UUID, db: Session) -> Employee:
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

def create_employee(employee_data: EmployeeCreate, db: Session) -> Employee:
    new_employee = Employee(**employee_data.dict())
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    return new_employee

def update_employee(employee_id: UUID, employee_data: EmployeeUpdate, db: Session) -> Employee:
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    for key, value in employee_data.dict(exclude_unset=True).items():
        setattr(employee, key, value)
    db.commit()
    db.refresh(employee)
    return employee

def delete_employee(employee_id: UUID, db: Session):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    db.delete(employee)
    db.commit()
