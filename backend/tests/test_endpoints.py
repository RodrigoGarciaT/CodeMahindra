import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

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
