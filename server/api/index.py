
# Import necessary modules and functions
from fastapi import FastAPI
from mysql import connector 

# Connect to the MySQL database
db_connection = connector.connect(
    host="localhost",
    user="yourusername",
    password="yourpassword",
)

# Create an instance of the FastAPI application
app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Welcome to the API!"}