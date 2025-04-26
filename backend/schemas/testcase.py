from pydantic import BaseModel
from typing import Optional

class TestCaseBase(BaseModel):
    input: str
    output: str
    problem_id: int

class TestCaseCreate(TestCaseBase):
    pass

class TestCaseUpdate(BaseModel):
    input: Optional[str] = None
    output: Optional[str] = None

class TestCaseOut(TestCaseBase):
    id: int

class TestCaseResult(BaseModel):
    id: int
    result: str
    time: Optional[str]
    memory: Optional[int]
    expected_output: Optional[str]
    output: Optional[str]
    
class TestInput(BaseModel):
    problem_id: int
    source_code: str
    input: str
    class Config:
        from_attributes = True
