
from fastapi import FastAPI
from api.users import router as users_router
from api.csv import router as csv_router

# Create an instance of the FastAPI application
app = FastAPI()

# Import routers for API 
app.include_router(users_router, prefix="/users")
app.include_router(csv_router, prefix="/csv")

# Define a simple root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to the API!"}