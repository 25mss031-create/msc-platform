from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from ..database import get_db
from ..models.course import Semester, Course, Unit, Lesson
from ..models.user import User
from ..auth import get_current_user

router = APIRouter()

@router.get("/semesters")
def get_semesters(db: Session = Depends(get_db)):
    semesters = db.query(Semester).order_by(Semester.semester_number).all()
    return [
        {
            "id": s.id,
            "semester_number": s.semester_number,
            "name": s.name,
            "description": s.description
        }
        for s in semesters
    ]

@router.get("/semesters/{semester_id}/courses")
def get_courses(semester_id: int, db: Session = Depends(get_db)):
    courses = db.query(Course).filter(Course.semester_id == semester_id).order_by(Course.order).all()
    return [
        {
            "id": c.id,
            "code": c.code,
            "name": c.name,
            "description": c.description,
            "credits": c.credits,
            "icon": c.icon,
            "skills_unlocked": c.skills_unlocked
        }
        for c in courses
    ]

@router.get("/courses/{course_id}")
def get_course_detail(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    units = db.query(Unit).filter(Unit.course_id == course_id).order_by(Unit.order).all()
    return {
        "id": course.id,
        "code": course.code,
        "name": course.name,
        "description": course.description,
        "credits": course.credits,
        "icon": course.icon,
        "skills_unlocked": course.skills_unlocked,
        "units": [
            {
                "id": u.id,
                "title": u.title,
                "description": u.description,
                "order": u.order,
                "lessons": [
                    {
                        "id": l.id,
                        "title": l.title,
                        "duration_minutes": l.duration_minutes,
                        "order": l.order,
                        "resources": l.resources
                    }
                    for l in db.query(Lesson).filter(Lesson.unit_id == u.id).order_by(Lesson.order).all()
                ]
            }
            for u in units
        ]
    }

@router.get("/lessons/{lesson_id}")
def get_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return {
        "id": lesson.id,
        "title": lesson.title,
        "content": lesson.content,
        "duration_minutes": lesson.duration_minutes,
        "order": lesson.order,
        "resources": lesson.resources
    }
