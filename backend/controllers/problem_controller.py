from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.problem import Problem
from schemas.problem import ProblemCreate, ProblemUpdate
from typing import List

def get_all_problems(db: Session) -> List[Problem]:
    return db.query(Problem).all()

def get_problem_by_id(problem_id: int, db: Session) -> Problem:
    problem = db.query(Problem).filter(Problem.id == problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    return problem

def create_problem(data: ProblemCreate, db: Session) -> Problem:
    new_problem = Problem(**data.dict())
    db.add(new_problem)
    db.commit()
    db.refresh(new_problem)
    return new_problem

def update_problem(problem_id: int, data: ProblemUpdate, db: Session) -> Problem:
    problem = db.query(Problem).filter(Problem.id == problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    for key, value in data.dict(exclude_unset=True).items():
        setattr(problem, key, value)
    db.commit()
    db.refresh(problem)
    return problem

def delete_problem(problem_id: int, db: Session):
    problem = db.query(Problem).filter(Problem.id == problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    db.delete(problem)
    db.commit()
