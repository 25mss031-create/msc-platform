from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, JSON
from ..database import Base

class Semester(Base):
    __tablename__ = "semesters"

    id = Column(Integer, primary_key=True, index=True)
    semester_number = Column(Integer, unique=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    semester_id = Column(Integer, ForeignKey("semesters.id"), nullable=False)
    code = Column(String, nullable=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    credits = Column(Integer, default=4)
    icon = Column(String, nullable=True)
    order = Column(Integer, default=0)
    skills_unlocked = Column(JSON, nullable=True)

class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    order = Column(Integer, default=0)

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id"), nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=True)
    duration_minutes = Column(Integer, default=15)
    order = Column(Integer, default=0)
    resources = Column(JSON, nullable=True)
