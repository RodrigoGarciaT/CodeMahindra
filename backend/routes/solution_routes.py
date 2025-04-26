from fastapi import APIRouter, Depends
from typing import List
from uuid import UUID
from sqlalchemy.orm import Session
from database import get_db
from schemas.solution import SolutionCreate, SolutionUpdate, SolutionOut, Submission
from schemas.testcase import TestCaseResult, TestInput
from controllers.solution_controller import (
    get_all_solutions,
    get_solution,
    create_solution,
    update_solution,
    delete_solution,
    test_code,
    get_test_case_results
)

router = APIRouter(prefix="/solutions", tags=["Solutions"])

@router.get("/", response_model=List[SolutionOut])
def list_solutions(db: Session = Depends(get_db)):
    return get_all_solutions(db)

@router.get("/{employee_id}/{problem_id}", response_model=SolutionOut)
def retrieve_solution(employee_id: UUID, problem_id: int, db: Session = Depends(get_db)):
    return get_solution(employee_id, problem_id, db)

@router.post("/", response_model=SolutionOut, status_code=201)
def create_new_solution(data: SolutionCreate, db: Session = Depends(get_db)):
    return create_solution(data, db)

@router.put("/{employee_id}/{problem_id}", response_model=SolutionOut)
def update_existing_solution(employee_id: UUID, problem_id: int, data: SolutionUpdate, db: Session = Depends(get_db)):
    return update_solution(employee_id, problem_id, data, db)

@router.delete("/{employee_id}/{problem_id}", status_code=204)
def delete_existing_solution(employee_id: UUID, problem_id: int, db: Session = Depends(get_db)):
    delete_solution(employee_id, problem_id, db)

# New routes for testing solutions
@router.post("/test", response_model=TestCaseResult)
def test_solution_code(data: TestInput, db: Session = Depends(get_db)):
    return test_code(data.problem_id, data.source_code, data.input)

@router.post("/test-results", response_model=List[TestCaseResult])
def get_submission_test_results(submission: Submission, db: Session = Depends(get_db)):
    return get_test_case_results(submission)