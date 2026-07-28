from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json
import os
from ..database import get_db
from ..models.course import Semester, Course, Unit, Lesson

router = APIRouter()

@router.post("/seed")
def seed_curriculum(db: Session = Depends(get_db)):
    existing = db.query(Semester).first()
    if existing:
        raise HTTPException(status_code=400, detail="Curriculum already seeded. Delete database file to re-seed.")

    data_path = os.path.join(os.path.dirname(__file__), "..", "data", "curriculum.json")
    with open(data_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    for sem_data in data["semesters"]:
        semester = Semester(
            semester_number=sem_data["semester_number"],
            name=sem_data["name"],
            description=sem_data.get("description", "")
        )
        db.add(semester)
        db.flush()

        for course_data in sem_data.get("courses", []):
            course = Course(
                semester_id=semester.id,
                code=course_data.get("code", ""),
                name=course_data["name"],
                description=course_data.get("description", ""),
                credits=course_data.get("credits", 4),
                icon=course_data.get("icon", ""),
                order=course_data.get("order", 0),
                    skills_unlocked=course_data.get("skills_unlocked", [])
            )
            db.add(course)
            db.flush()

            for unit_data in course_data.get("units", []):
                unit = Unit(
                    course_id=course.id,
                    title=unit_data["title"],
                    description=unit_data.get("description", ""),
                    order=unit_data.get("order", 0)
                )
                db.add(unit)
                db.flush()

                for lesson_data in unit_data.get("lessons", []):
                    lesson = Lesson(
                        unit_id=unit.id,
                        title=lesson_data["title"],
                        content=lesson_data.get("content", ""),
                        duration_minutes=lesson_data.get("duration_minutes", 15),
                        order=lesson_data.get("order", 0),
                        resources=lesson_data.get("resources", [])
                    )
                    db.add(lesson)

    db.commit()
    return {"message": "Curriculum seeded successfully"}
