from fastapi import FastAPI
from backend.database import engine

print("✅ DATABASE LOADED")

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Backend is running 🚀"}