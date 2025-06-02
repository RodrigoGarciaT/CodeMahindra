from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from github import get_grouped_commits, get_pull_requests, get_user_repos
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.employee import Employee
from auth import get_current_user

app = FastAPI(
    title="CodeMahindra GitHub Webhook Analyzer",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/commits")
async def get_commits(branch: str = Query(default="main")):
    return await get_grouped_commits(branch)

@app.get("/pull-requests")
async def pull_requests_endpoint():
    return await get_pull_requests()

@app.get("/github/repos")
async def github_repos(
    db: Session = Depends(get_db),
    user: Employee = Depends(get_current_user)
):
    if not user.github_token or not user.github_username:
        raise HTTPException(status_code=400, detail="El usuario no tiene GitHub vinculado")

    repos = await get_user_repos(user.github_token)
    return repos