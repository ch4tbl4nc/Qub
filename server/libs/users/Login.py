from typing import Dict, Any
import bcrypt
from libs.database.RunQuery import run_query

def login_user(username: str, password: str) -> Dict[str, Any]:
    """
    Vérifie les identifiants utilisateur.
    Retourne dict avec success + user_id ou error.
    """
    query = "SELECT id, password_hash FROM users WHERE username = %s LIMIT 1"
    params = (username,)
    result = run_query(query, params, fetch=True)
    
    if not result:
        return {'success': False, 'error': 'Identifiants invalides'}
    
    user_row = result[0]
    user_id = user_row[0]
    pw_hash = user_row[1]

    # prepared cursor peut retourner bytes
    if isinstance(pw_hash, str):
        pw_hash = pw_hash.encode('utf-8')
    
    # encode password pour bcrypt
    password_bytes = password.encode('utf-8')
    
    # vérification du hash
    if not bcrypt.checkpw(password_bytes, pw_hash):
        return {'success': False, 'error': 'Identifiants invalides'}
    
    return {'success': True, 'user_id': int(user_id)}