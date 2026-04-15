from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import engine
from backend import models

print("✅ MODELS LOADED")

# ✅ Create app ONLY ONCE
app = FastAPI()

# ✅ CORS
origins = [
    "http://localhost:3000",
    "https://inventory-management-app-5lj8-ancjpxccl.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Routes
@app.get("/")
def read_root():
    return {"message": "Backend is running 🚀"}