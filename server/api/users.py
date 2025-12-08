# Import neccessary modules and functions
from fastapi import APIRouter
from libs.database import run_query

# Create a router instance
router = APIRouter()

# Define a simple root endpoint
@router.get("/")
async def root():
    return {"message": "Hello Users !"}