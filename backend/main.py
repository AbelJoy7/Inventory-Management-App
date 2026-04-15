from fastapi import FastAPI
from backend.database import engine
from backend import models
from fastapi import FastAPI
from backend.database import engine
from backend import models

print("✅ MODELS LOADED")

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Backend is running 🚀"}

print("✅ MODELS LOADED")

app = FastAPI()