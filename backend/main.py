from fastapi import FastAPI
from backend.database import engine
from backend import models

print("✅ MODELS LOADED")

app = FastAPI()