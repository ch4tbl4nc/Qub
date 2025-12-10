
from fastapi import FastAPI
from server.libs.database.Config import run_query
from api.users import router as users_router

# Create an instance of the FastAPI application
app = FastAPI()

# Import routers for API 
app.include_router(users_router, prefix="/users")

# Define a simple root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to the API!"}