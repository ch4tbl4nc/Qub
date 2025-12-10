from typing import Dict, Any
from passlib.context import CryptContext
from libs.database.RunQuery import run_query

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def login_user(username: str, password: str) -> Dict[str, Any]:
    query = "SELECT id, password_hash FROM users WHERE username = %s LIMIT 1"
    params = (username,)
    result = run_query(query, params, fetch=True)
    
    if not result:
        return {'success': False, 'message': 'User not found'}
    
    user_row = result[0]
    user_id = user_row[0]
    pw_hash = user_row[1]

    # prepared queries can return byte strings for text fields; decode if needed
    if isinstance(pw_hash, (bytes, bytearray)):
        pw_hash = pw_hash.decode()

    # Check the password
    if not pwd_context.verify(password, pw_hash):
        return {'success': False, 'message': 'Incorrect password'}
    
    # Success
    return {'success': True, 'user_id': user_id}