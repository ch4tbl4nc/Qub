from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr, constr
from libs.users.Register import register_user
from libs.users.Login import login_user
from libs.jwt.jwt_utils import create_access_token, verify_access_token
from libs.totp.totp_utils import generate_totp_secret, get_totp_uri, verify_totp_code, generate_qr_code
from libs.database.RunQuery import run_query
import pyotp

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
    totp_code: str | None = None

class TOTPEnable(BaseModel):
    user_id: int

class TOTPVerify(BaseModel):
    user_id: int
    code: str

@router.get("/")
async def root():
    return {"message": "Hello Users !"}

@router.get("/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return {"user": current_user}

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserRegister):
    """Inscription d'un nouvel utilisateur"""
    result = register_user(user.username, user.email, user.password)
    if not result.get('success'):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result.get('error'))
    return {"message": result.get('message')}

@router.post("/login")
async def login(user: UserLogin):
    """Connexion avec vérification TOTP si activé"""
    result = login_user(user.username, user.password)
    if not result.get('success'):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=result.get('error'))
    
    user_id = result.get('user_id')
    
    # Vérifie si TOTP activé pour cet utilisateur
    query = "SELECT totp_enabled, totp_secret FROM users WHERE id = %s"
    totp_result = run_query(query, (user_id,), fetch=True)
    
    if totp_result and totp_result[0][0]:  # totp_enabled = True
        if not user.totp_code:
            raise HTTPException(status_code=400, detail="Code TOTP requis")
        
        secret = totp_result[0][1]
        if isinstance(secret, bytes):
            secret = secret.decode()
        
        if not verify_totp_code(secret, user.totp_code):
            raise HTTPException(status_code=401, detail="Code TOTP invalide")
    
    token = create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

@router.post("/totp/enable")
async def enable_totp(data: TOTPEnable):
    """Génère un secret TOTP et retourne le secret + QR code"""
    secret = generate_totp_secret()
    
    query = "SELECT username FROM users WHERE id = %s"
    result = run_query(query, (data.user_id,), fetch=True)
    if not result:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    
    username = result[0][0]
    if isinstance(username, bytes):
        username = username.decode()
    
    update_q = "UPDATE users SET totp_secret = %s WHERE id = %s"
    run_query(update_q, (secret, data.user_id), fetch=False)
    
    uri = get_totp_uri(secret, username)  # ← ordre corrigé
    
    return {
        "secret": secret,
        "uri": uri,
        "message": f"Entre ce secret dans Google Authenticator : {secret}"
    }

@router.post("/totp/verify")
async def verify_totp(data: TOTPVerify):
    """Vérifie le code TOTP et active la 2FA"""
    query = "SELECT totp_secret FROM users WHERE id = %s"
    result = run_query(query, (data.user_id,), fetch=True)
    if not result or not result[0][0]:
        raise HTTPException(status_code=404, detail="2FA non initialisée")
    
    secret = result[0][0]
    if isinstance(secret, bytes):
        secret = secret.decode()

    if not verify_totp_code(secret, data.code):
        raise HTTPException(status_code=400, detail="Code TOTP invalide")
    
    update_q = "UPDATE users SET totp_enabled = TRUE WHERE id = %s"
    run_query(update_q, (data.user_id,), fetch=False)

    return {"message": "2FA activée avec succès"}

@router.post("/totp/generate-code")
async def generate_test_code(data: TOTPEnable):
    """ENDPOINT DE DEBUG - Génère le code TOTP actuel (supprimer en prod)"""
    query = "SELECT totp_secret FROM users WHERE id = %s"
    result = run_query(query, (data.user_id,), fetch=True)
    if not result or not result[0][0]:
        raise HTTPException(status_code=400, detail="2FA non initialisée")
    
    secret = result[0][0]
    if isinstance(secret, bytes):
        secret = secret.decode()
    
    totp = pyotp.TOTP(secret)
    current_code = totp.now()
    
    return {
        "code": current_code,
        "message": "Utilise ce code dans les 30 secondes"
    }