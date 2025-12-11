
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr, constr
from libs.users.Register import register_user
from libs.users.Login import login_user
from libs.users.jwt_utils import create_access_token, verify_access_token

# Create a router instance
router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalide ou expiré")
    return payload

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
    token = create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return {"user": current_user}