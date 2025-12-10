from typing import Dict, Any
from passlib.context import CryptContext
from libs.database.RunQuery import run_query

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def register_user(username: str, email: str, password: str) -> Dict[str, Any]:
    check_q = "SELECT id FROM users WHERE username = %s OR email = %s LIMIT 1"
    if run_query(check_q, (username, email), fetch=True):
        return {"success": False, "error": "Nom d'utilisateur ou email déjà utilisé"}
    
    password_hash = pwd_context.hash(password)

    insert_q = "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)"
    rowcount = run_query(insert_q, (username, email, password_hash), fetch=False)


    if not rowcount or rowcount == 0:
        return {'success': False, 'message': 'Registration failed'}
    
    return {'success': True, 'message': 'User registered successfully'}