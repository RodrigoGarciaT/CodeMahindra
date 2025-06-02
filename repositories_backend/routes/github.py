from fastapi import APIRouter, Depends, Query
from utils.auth import get_email_from_jwt
from services.github_service import (
    get_user_github_credentials,
    fetch_github_repos,
    get_grouped_commits,
    get_pull_requests,
    get_commit_feedback
)

router = APIRouter()

@router.get("/github/repos")
def get_repos(email: str = Depends(get_email_from_jwt)):
    token, _ = get_user_github_credentials(email)
    return fetch_github_repos(token)

@router.get("/github/commits")
async def commits(
    repo: str = Query(..., description="Formato: owner/repo"),
    branch: str = Query("main"),
    email: str = Depends(get_email_from_jwt)
):
    token, username = get_user_github_credentials(email)
    return await get_grouped_commits(token, repo, branch, username)

@router.get("/github/pull-requests")
async def pull_requests(
    repo: str = Query(..., description="Formato: owner/repo"),
    email: str = Depends(get_email_from_jwt)
):
    token, username = get_user_github_credentials(email)
    return await get_pull_requests(token, repo, username)

@router.get("/github/commit-feedback")
async def commit_feedback(
    repo: str = Query(..., description="Formato: owner/repo"),
    sha: str = Query(...),
    email: str = Depends(get_email_from_jwt)
):
    token, _ = get_user_github_credentials(email)
    return await get_commit_feedback(token, repo, sha)
