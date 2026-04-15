import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Get DB URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

# 🚨 Safety check
if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in environment variables")

# Fix for Render
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://")

# Create engine
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# Session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base
Base = declarative_base()