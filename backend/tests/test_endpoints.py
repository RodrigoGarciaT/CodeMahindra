import os
import sys
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, get_db

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

# Test database URL
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/mahindra_test")

# Create test engine
engine = create_engine(DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override the dependency
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_database():
    # Create tables
    Base.metadata.create_all(bind=engine)
    yield
    # Clean up after tests
    Base.metadata.drop_all(bind=engine)

def test_ranking_endpoint():
    response = client.get("/ranking/")
    assert response.status_code == 200

def test_employees_endpoint():
    response = client.get("/employees/")
    assert response.status_code == 200

def test_teams_endpoint():
    response = client.get("/teams/")
    assert response.status_code == 200

def test_positions_endpoint():
    response = client.get("/positions/")
    assert response.status_code == 200
