from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.solution import Solution
from schemas.solution import SolutionCreate, SolutionUpdate, Submission
from schemas.testcase import TestCaseOut, TestCaseResult
from typing import List
import asyncio
import httpx
import random
from models.problem import Problem
from pydantic import BaseModel
from typing import Optional
from models.testcase import TestCase

import os
from dotenv import load_dotenv
load_dotenv()

JUDGE0_CONFIG = {
    'url': os.getenv('JUDGE0_URL'),
    'headers': {
        'content-type': 'application/json',
        'x-rapidapi-key': os.getenv('JUDGE0_API_KEY'),
        'x-rapidapi-host': os.getenv('JUDGE0_API_HOST')
    }
}

language_map = {
    'Python': 71,
    'C++': 54,
    'Java': 62,
    'Javascript': 63
}

class TestCaseBase(BaseModel):
    input: str
    output: str
    problem_id: int
    id: int

class TestCaseOut(TestCaseBase):
    id: int

class TestCaseResult(BaseModel):
    id: int
    result: str
    time: Optional[str]
    memory: Optional[int]
    expected_output: Optional[str]
    output: Optional[str]

async def submit_code_to_judge0(source_code, stdin, language, expected_output=None):
    if language not in language_map:
        return {'result': 'Language Not Supported'}

    language_id = language_map[language]

    payload = {
        "language_id": language_id,
        "source_code": source_code,
        "stdin": stdin
    }

    if expected_output is not None:
        payload["expected_output"] = expected_output

    # print(JUDGE0_CONFIG['url'])
    # print(JUDGE0_CONFIG['headers'])
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(JUDGE0_CONFIG['url'], headers=JUDGE0_CONFIG['headers'], json=payload, timeout=10)
        response.raise_for_status()
        return response.json()
    except httpx.TimeoutException as e:
        return {'timeout': True}
    except Exception as e:
        return {'error': str(e)}

async def evaluate_code(source_code, stdin, expected_output, language) -> TestCaseResult:
    result = await submit_code_to_judge0(source_code, stdin, language, expected_output)

    if result.get('timeout'):
        return TestCaseResult(id=-1, result='TL', time=None, memory=None, expected_output=expected_output, output=None)
    if result.get('error'):
        return TestCaseResult(id=-1, result='RE', time=None, memory=None, expected_output=expected_output, output=None)

    status_id = result.get('status', {}).get('id', 0)
    time_taken = result.get('time')
    memory_used = result.get('memory')
    stdout = result.get('stdout')

    if status_id == 3:
        verdict = 'AC'
    elif status_id == 4:
        verdict = 'WA'
    elif status_id == 5:
        verdict = 'TL'
    elif status_id == 6:
        verdict = 'CE'
    else:
        verdict = 'RE'

    return TestCaseResult(
        id=-1,
        result=verdict,
        time=time_taken,
        memory=memory_used,
        expected_output=expected_output,
        output=stdout
    )

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

async def test_code(problem_id: int, source_code: str, input: str, language: str, db: Session) -> TestCaseResult:
    # 1. Get the problem's solution code
    problem = db.query(Problem).filter(Problem.id == problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    if not problem.solution:
        raise HTTPException(status_code=400, detail="Problem has no reference solution")
    
    # 2. Get expected output by running the problem's solution code
    solution_result = await evaluate_code(
        source_code=problem.solution,
        stdin=input,
        expected_output=None,  # We just want the output
        language=problem.language
    )
    print(source_code)
    print(problem.language)
    
    if solution_result.result != 'AC':
        raise HTTPException(
            status_code=400,
            detail=f"Reference solution failed with status: {solution_result.result}"
        )
    
    expected_output = solution_result.output
    
    print(language)
    print(source_code)
    print(input)
    print(expected_output)
    # 3. Evaluate the submitted code against the expected output
    test_result = await evaluate_code(
        source_code=source_code,
        stdin=input,
        expected_output=expected_output,
        language=language
    )
    # print(test_result.output)
    return test_result

async def evaluate_testcases(
    source_code: str,
    language: str,
    testcases: List[TestCaseBase]
) -> List[TestCaseResult]:
    """
    Evaluate code against multiple test cases.
    
    Args:
        source_code: The source code to evaluate
        language: Programming language (must match language_map keys)
        testcases: List of TestCaseBase objects containing input/output pairs
        
    Returns:
        List of TestCaseResult objects with evaluation results
    """
    async def process_testcase(testcase: TestCaseBase) -> TestCaseResult:
        result = await evaluate_code(
            source_code=source_code,
            stdin=testcase.input,
            expected_output=testcase.output,
            language=language
        )
        
        return TestCaseResult(
            id=testcase.id,
            result=result.result,
            time=result.time,
            memory=result.memory,
            expected_output=testcase.output,
            output=result.output,
            error_details=result.error_details if hasattr(result, 'error_details') else None
        )

    # Process all test cases concurrently
    tasks = [process_testcase(tc) for tc in testcases]
    return await asyncio.gather(*tasks)

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

async def get_test_case_results(submission: Submission, db: Session) -> List[TestCaseResult]:
    # 1. Get all test cases for the problem from database
    db_test_cases = db.query(TestCase).filter(
        TestCase.problem_id == submission.problem_id
    ).all()
    
    if not db_test_cases:
        raise HTTPException(
            status_code=404,
            detail="No test cases found for this problem"
        )
    
    # 2. Convert SQLAlchemy TestCase objects to TestCaseBase objects
    testcases = [
        TestCaseBase(
            id=tc.id,
            input=tc.input,
            output=tc.output,
            problem_id=tc.problem_id
        ) for tc in db_test_cases
    ]
    
    # 3. Evaluate against all test cases using evaluate_testcases
    results = await evaluate_testcases(
        source_code=submission.source_code,
        language=submission.language,
        testcases=testcases
    )
    return results


'''
    en get_test_case_results primero conseguimos los testcases
    
    despues los evaluamos y retornamos eso

'''