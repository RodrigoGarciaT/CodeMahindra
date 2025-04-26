from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.solution import Solution
from schemas.solution import SolutionCreate, SolutionUpdate, Submission
from schemas.testcase import TestCaseOut, TestCaseResult
from typing import List
import asyncio
import httpx
import random


headers = {
    'content-type': "application/json",
    'x-rapidapi-key': "ae5dfb3c2amsh0245873f3cc2ae5p1dd10cjsn99b478674369",
    'x-rapidapi-host': "judge0-ce.p.rapidapi.com"
}

language_map = {
    'python': 71,
    'cpp': 54,
    'java': 62,
    'javascript': 63
}

def get_all_solutions(db: Session) -> List[Solution]:
    return db.query(Solution).all()

def get_solution(employee_id, problem_id, db: Session) -> Solution:
    sol = db.query(Solution).filter(
        Solution.employee_id == employee_id,
        Solution.problem_id == problem_id
    ).first()
    if not sol:
        raise HTTPException(status_code=404, detail="Solution not found")
    return sol

def create_solution(data: SolutionCreate, db: Session) -> Solution:
    existing = db.query(Solution).filter(
        Solution.employee_id == data.employee_id,
        Solution.problem_id == data.problem_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Solution already exists")
    sol = Solution(**data.dict())
    db.add(sol)
    db.commit()
    db.refresh(sol)
    return sol

def update_solution(employee_id, problem_id, data: SolutionUpdate, db: Session) -> Solution:
    sol = db.query(Solution).filter(
        Solution.employee_id == employee_id,
        Solution.problem_id == problem_id
    ).first()
    if not sol:
        raise HTTPException(status_code=404, detail="Solution not found")
    for key, value in data.dict(exclude_unset=True).items():
        setattr(sol, key, value)
    db.commit()
    db.refresh(sol)
    return sol

def delete_solution(employee_id, problem_id, db: Session):
    sol = db.query(Solution).filter(
        Solution.employee_id == employee_id,
        Solution.problem_id == problem_id
    ).first()
    if not sol:
        raise HTTPException(status_code=404, detail="Solution not found")
    db.delete(sol)
    db.commit()

# Sample function to generate a random test case result
def generate_random_test_case_result() -> TestCaseResult:
    status = random.choice(['AC', 'WA', 'TL', 'RE'])
    time = round(random.uniform(0.1, 1.5), 3) 
    memory = random.randint(10, 100)  
    expected_output = "expected_output" 
    output = "output"  

    return TestCaseResult(
        id=random.randint(1, 1000),
        result=status,
        time=str(time),
        memory=memory,
        expected_output=expected_output,
        output=output
    )

# Function to test the code for a specific problem_id and return a single TestCaseResult (random and assumed to pass)
def test_code(problem_id: int, source_code: str, input: str) -> TestCaseResult:
    return generate_random_test_case_result()

# Function to return a list of random TestCaseResult for a submission
def get_test_case_results(submission: Submission) -> List[TestCaseResult]:
    test_cases = [generate_random_test_case_result() for _ in range(10)]
    return test_cases

'''
class Submission(SolutionBase):
    employee_id: UUID
    problem_id: int
    source_code: str
'''

