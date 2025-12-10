
from fastapi import APIRouter
from libs.database.RunQuery import run_query

# Create a router instance
router = APIRouter()

# Define a simple root endpoint
@router.get("/")
async def root():
    return {"message": "Hello Users !"}

@router.get("/test")
async def get_all_users():
    query = "INSERT INTO users (id, username) VALUES (%s, %s)"
    params = (1, 'testuser')

    try:
        run_query(query, params)
        return {"message": "User inserted successfully."}
    except Exception as e:
        return {"error": str(e)}    


