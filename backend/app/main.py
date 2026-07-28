from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .config import settings
from .api import auth, courses, progress, seed

Base.metadata.create_all(bind=engine)

app = FastAPI(title="M.Sc. Software Systems Learning Platform", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(courses.router, prefix="/api/courses", tags=["courses"])
app.include_router(progress.router, prefix="/api/progress", tags=["progress"])
app.include_router(seed.router, prefix="/api", tags=["seed"])

@app.get("/api/health")
def health_check():
    return {"status": "ok", "version": "1.0.0"}
