from fastapi import FastAPI

print("🔥 APP STARTED")

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Backend is running 🚀"}