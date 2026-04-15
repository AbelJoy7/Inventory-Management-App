from fastapi import FastAPI
from backend.database import engine
from backend import models
from fastapi import FastAPI
from backend.database import engine
from backend import models
from fastapi.middleware.cors import CORSMiddleware

print("✅ MODELS LOADED")

app = FastAPI()
origins = [
    "http://localhost:3000",
    "https://inventory-management-app-5lj8-ancjpxccl.vercel.app",  # replace this
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Backend is running 🚀"}

print("✅ MODELS LOADED")

app = FastAPI()