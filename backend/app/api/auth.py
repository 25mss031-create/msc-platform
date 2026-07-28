from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter()

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    current_semester: int

    class Config:
        from_attributes = True

@router.post("/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        name=req.name,
        email=req.email,
        password_hash=hash_password(req.password),
        current_semester=1
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token({"sub": user.id})
    return {"token": token, "user": {"id": user.id, "name": user.name, "email": user.email, "current_semester": user.current_semester}}

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not user.password_hash:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.id})
    return {"token": token, "user": {"id": user.id, "name": user.name, "email": user.email, "current_semester": user.current_semester}}

@router.get("/me")
def get_me(user: User = Depends(get_current_user)):
    return {"id": user.id, "name": user.name, "email": user.email, "current_semester": user.current_semester}
