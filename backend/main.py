from fastapi import FastAPI,Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import models
from fastapi import Depends
from sqlalchemy.orm import Session
from backend.database import engine, Base, SessionLocal


app = FastAPI()

# 👇 Step 1: Add your frontend URLs here
origins = [
    "http://localhost:3000",  # for local testing
    "https://inventory-management-app-5lj8-ancjpxccl.vercel.app",  # 🔥 replace this
]

# 👇 Step 2: Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Your existing APIs (no change)
@app.get("/")
def read_root():
    return {"message": "Backend is running 🚀"}

@app.get("/health")
def health():
    return {"status": "ok"}

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
app = FastAPI()
from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    # Find user in DB
    user = db.query(models.User).filter(models.User.username == data.username).first()

    # Check user exists
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    # Check password
    if user.password != data.password:
        raise HTTPException(status_code=401, detail="Incorrect password")

    return {
        "message": "Login successful",
        "username": user.username
    }

    from database import SessionLocal
import models

db = SessionLocal()
test_user = models.User(username="admin", password="admin123")
db.add(test_user)
db.commit()
db.close()