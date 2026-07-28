from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from ..database import get_db
from ..models.course import Course, Unit, Lesson
from ..models.progress import UserProgress, UserCourseProgress
from ..models.user import User
from ..auth import get_current_user

router = APIRouter()

class CompleteLessonRequest(BaseModel):
    course_id: int
    lesson_id: int

@router.post("/lessons/complete")
def complete_lesson(req: CompleteLessonRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    lesson = db.query(Lesson).filter(Lesson.id == req.lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    existing = db.query(UserProgress).filter(
        UserProgress.user_id == user.id,
        UserProgress.lesson_id == req.lesson_id
    ).first()
    if existing:
        existing.completed = True
        existing.completed_at = datetime.now(timezone.utc)
    else:
        up = UserProgress(
            user_id=user.id,
            course_id=req.course_id,
            lesson_id=req.lesson_id,
            completed=True,
            completed_at=datetime.now(timezone.utc)
        )
        db.add(up)
    db.commit()
    return {"message": "Lesson completed"}

@router.get("/courses/{course_id}")
def get_course_progress(course_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    total_lessons = db.query(Lesson).join(Unit).filter(Unit.course_id == course_id).count()
    completed_lessons = db.query(UserProgress).filter(
        UserProgress.user_id == user.id,
        UserProgress.course_id == course_id,
        UserProgress.completed == True
    ).count()
    return {
        "course_id": course_id,
        "total_lessons": total_lessons,
        "completed_lessons": completed_lessons,
        "progress_pct": round((completed_lessons / total_lessons * 100), 1) if total_lessons > 0 else 0
    }

@router.get("/overview")
def get_progress_overview(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    courses = db.query(Course).all()
    result = []
    for course in courses:
        total = db.query(Lesson).join(Unit).filter(Unit.course_id == course.id).count()
        completed = db.query(UserProgress).filter(
            UserProgress.user_id == user.id,
            UserProgress.course_id == course.id,
            UserProgress.completed == True
        ).count()
        result.append({
            "course_id": course.id,
            "course_name": course.name,
            "total_lessons": total,
            "completed_lessons": completed,
            "progress_pct": round((completed / total * 100), 1) if total > 0 else 0
        })
    return result

@router.get("/unlocked-skills")
def get_unlocked_skills(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    completed_courses = db.query(UserCourseProgress).filter(
        UserCourseProgress.user_id == user.id,
        UserCourseProgress.completed == True
    ).all()
    skills = []
    for cp in completed_courses:
        course = db.query(Course).filter(Course.id == cp.course_id).first()
        if course and course.skills_unlocked:
            skills.extend(course.skills_unlocked)
    return {"unlocked_skills": skills}
