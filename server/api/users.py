from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr, constr
from libs.users.Register import register_user
from libs.users.Login import login_user
from libs.jwt.jwt_utils import create_access_token, verify_access_token
from libs.totp.totp_utils import generate_totp_secret, get_totp_uri, verify_totp_code, generate_qr_code
from libs.database.RunQuery import run_query
import pyotp
import bcrypt

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalide ou expiré")
    return payload

class UserRegister(BaseModel):
    username: constr(min_length=6, max_length=25)
    company: constr(min_length=6, max_length=25)
    email: EmailStr
    password: constr(min_length=14)

class UserLogin(BaseModel):
    username: constr(min_length=6, max_length=25)
    password: constr(min_length=14)
    totp_code: str | None = None

class TOTPEnable(BaseModel):
    user_id: int

class TOTPVerify(BaseModel):
    code: str
    secret: str

class ChangePassword(BaseModel):
    current_password: str
    new_password: constr(min_length=14)

@router.post("/change-password")
async def change_password(data: ChangePassword, current_user: dict = Depends(get_current_user)):
    """Change le mot de passe de l'utilisateur connecté"""
    username = current_user.get('sub')
    
    # Vérifier l'ancien mot de passe
    query = "SELECT password_hash FROM users WHERE username = %s"
    result = run_query(query, (username,), fetch=True)
    
    if not result:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    
    stored_password = result[0][0]
    if isinstance(stored_password, bytes):
        stored_password = stored_password.decode()
    
    # Vérifier que l'ancien mot de passe est correct
    if not bcrypt.checkpw(data.current_password.encode('utf-8'), stored_password.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Mot de passe actuel incorrect")
    
    # Hasher le nouveau mot de passe
    new_hashed = bcrypt.hashpw(data.new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    # Mettre à jour le mot de passe
    update_query = "UPDATE users SET password_hash = %s WHERE username = %s"
    run_query(update_query, (new_hashed, username), fetch=False)
    
    return {"message": "Mot de passe changé avec succès"}

@router.post("/2fa/enable")
async def enable_2fa(current_user: dict = Depends(get_current_user)):
    """Génère un secret TOTP et retourne le QR code"""
    username = current_user.get('sub')
    secret = generate_totp_secret()
    
    # Sauvegarder le secret (mais ne pas encore activer)
    query = "UPDATE users SET totp_secret = %s WHERE username = %s"
    run_query(query, (secret, username), fetch=False)
    
    # Générer le QR code
    uri = get_totp_uri(secret, username, "QUB")
    qr_code = generate_qr_code(uri)
    
    return {
        "secret": secret,
        "qr_code": qr_code,
        "message": "Scannez le QR code avec Google Authenticator"
    }

@router.post("/2fa/verify")
async def verify_2fa(data: TOTPVerify, current_user: dict = Depends(get_current_user)):
    """Vérifie le code TOTP et active la 2FA"""
    username = current_user.get('sub')
    
    if not verify_totp_code(data.secret, data.code):
        raise HTTPException(status_code=400, detail="Code invalide")
    
    # Activer la 2FA
    query = "UPDATE users SET totp_enabled = TRUE WHERE username = %s"
    run_query(query, (username,), fetch=False)
    
    return {"message": "Authentification à deux facteurs activée"}

@router.post("/2fa/disable")
async def disable_2fa(current_user: dict = Depends(get_current_user)):
    """Désactive la 2FA"""
    username = current_user.get('sub')
    
    query = "UPDATE users SET totp_enabled = FALSE, totp_secret = NULL WHERE username = %s"
    run_query(query, (username,), fetch=False)
    
    return {"message": "Authentification à deux facteurs désactivée"}

@router.get("/")
async def root():
    return {"message": "Hello Users !"}

@router.get("/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    """Récupère les informations complètes de l'utilisateur connecté"""
    username = current_user.get('sub')
    query = "SELECT id, username, role, totp_enabled FROM users WHERE username = %s"
    result = run_query(query, (username,), fetch=True)
    
    if not result:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    
    user_data = result[0]
    return {
        "id": int(user_data[0]),
        "username": user_data[1].decode() if isinstance(user_data[1], bytes) else user_data[1],
        "role": user_data[2].decode() if isinstance(user_data[2], bytes) else user_data[2],
        "totp_enabled": bool(user_data[3])
    }

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserRegister):
    """Inscription d'un nouvel utilisateur"""
    result = register_user(user.username, user.company, user.email, user.password)
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
    user_role = result.get('role')
    
    # Vérifie si TOTP activé pour cet utilisateur
    query = "SELECT totp_enabled, totp_secret FROM users WHERE id = %s"
    totp_result = run_query(query, (user_id,), fetch=True)
    
    if totp_result and totp_result[0][0]:  # totp_enabled = True
        if not user.totp_code:
            # Retourner un code spécial pour indiquer qu'un code TOTP est requis
            return {
                "requires_totp": True,
                "message": "Code d'authentification à deux facteurs requis"
            }
        
        secret = totp_result[0][1]
        if isinstance(secret, bytes):
            secret = secret.decode()
        
        if not verify_totp_code(secret, user.totp_code):
            raise HTTPException(status_code=401, detail="Code d'authentification invalide")
    
    token = create_access_token({"sub": user.username, "role": user_role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "requires_totp": False
    }

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