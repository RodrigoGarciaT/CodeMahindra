from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException
from models.comment import Comment
from models.employee import Employee
from schemas.comment import CommentCreate, CommentUpdate, CommentOut
from typing import List

def get_all_comments(db: Session) -> List[CommentOut]:
    comments = db.query(Comment).options(joinedload(Comment.employee)).all()
    return [
        CommentOut(
            id=comment.id,
            description=comment.description,
            messageDate=comment.messageDate,
            employee_id=comment.employee_id,
            problem_id=comment.problem_id,
            firstName=comment.employee.firstName if comment.employee.firstName else "",
            lastName=comment.employee.lastName if comment.employee.lastName else "",
            profilePicture=comment.employee.profileEpic if comment.employee.profileEpic else "https://st.depositphotos.com/2218212/2938/i/450/depositphotos_29387653-stock-photo-facebook-profile.jpg"
        )
        for comment in comments
    ]

def get_comments_by_problemid(problem_id: int, db: Session) -> List[CommentOut]:
    comments = (
        db.query(Comment)
        .options(joinedload(Comment.employee))
        .filter(Comment.problem_id == problem_id)
        .all()
    )
    
    return [
        CommentOut(
            id=comment.id,
            description=comment.description,
            messageDate=comment.messageDate,
            employee_id=comment.employee_id,
            problem_id=comment.problem_id,
            firstName=comment.employee.firstName if comment.employee.firstName else "",
            lastName=comment.employee.lastName if comment.employee.lastName else "",
            profilePicture=comment.employee.profilePicture if comment.employee.profilePicture else "https://st.depositphotos.com/2218212/2938/i/450/depositphotos_29387653-stock-photo-facebook-profile.jpg"
        )
        for comment in comments
    ]

def get_comment_by_id(comment_id: int, db: Session) -> CommentOut:
    comment = db.query(Comment).options(joinedload(Comment.employee)).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    return CommentOut(
        id=comment.id,
        description=comment.description,
        messageDate=comment.messageDate,
        employee_id=comment.employee_id,
        problem_id=comment.problem_id,
        firstName=comment.employee.firstName if comment.employee.firstName else "",
        lastName=comment.employee.lastName if comment.employee.lastName else "",
        profilePicture=comment.employee.profileEpic if comment.employee.profileEpic else "https://st.depositphotos.com/2218212/2938/i/450/depositphotos_29387653-stock-photo-facebook-profile.jpg"
    )

def create_comment(data: CommentCreate, db: Session) -> CommentOut:
    employee = db.query(Employee).filter(Employee.id == data.employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    new_comment = Comment(**data.dict())
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    return CommentOut(
        id=new_comment.id,
        description=new_comment.description,
        messageDate=new_comment.messageDate,
        employee_id=new_comment.employee_id,
        problem_id=new_comment.problem_id,
        firstName=employee.firstName if employee.firstName else "",
        lastName=employee.lastName if employee.lastName else "",  # Fixed here
        profilePicture=employee.profileEpic if employee.profileEpic else "https://st.depositphotos.com/2218212/2938/i/450/depositphotos_29387653-stock-photo-facebook-profile.jpg"
    )


def update_comment(comment_id: int, data: CommentUpdate, db: Session) -> CommentOut:
    comment = db.query(Comment).options(joinedload(Comment.employee)).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    for key, value in data.dict(exclude_unset=True).items():
        setattr(comment, key, value)

    db.commit()
    db.refresh(comment)

    return CommentOut(
        id=comment.id,
        description=comment.description,
        messageDate=comment.messageDate,
        employee_id=comment.employee_id,
        problem_id=comment.problem_id,
        firstName=comment.employee.firstName if comment.employee.firstName else "",
        lastName=comment.employee.lastName if comment.employee.lastName else "",
        profilePicture=comment.employee.profileEpic if comment.employee.profileEpic else "https://st.depositphotos.com/2218212/2938/i/450/depositphotos_29387653-stock-photo-facebook-profile.jpg"
    )

def delete_comment(comment_id: int, db: Session):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    db.delete(comment)
    db.commit()
