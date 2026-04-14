from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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