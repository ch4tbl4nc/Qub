
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, constr
from libs.users.Register import register_user
from libs.users.Login import login_user

# Create a router instance
router = APIRouter()

class UserRegister(BaseModel):
    username: constr(min_length=6, max_length=25)
    email: EmailStr
    password: constr(min_length=14)

class UserLogin(BaseModel):
    username: constr(min_length=6, max_length=25)
    password: constr(min_length=14)
    
# Define a simple root endpoint
@router.get("/")
async def root():
    return {"message": "Hello Users !"}

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserRegister):
    result = register_user(user.username, user.email, user.password)
    if not result.get('success'):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result.get('error'))
    return {"message": result.get('message')}

@router.post("/login")
async def login(user: UserLogin):

    result = login_user(user.username, user.password)
    if not result.get('success'):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=result.get('error'))
    return {"message": "Authenticated", "user_id": result.get("user_id")}


# @router.get("/test")
# async def get_all_users():
#     query = "INSERT INTO users (id, username) VALUES (%s, %s)"
#     params = (1, 'testuser')

#     try:
#         run_query(query, params)
#         return {"message": "User inserted successfully."}
#     except Exception as e:
#         return {"error": str(e)}    
