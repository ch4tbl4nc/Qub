from typing import Dict, Any
import bcrypt
from libs.database.RunQuery import run_query

def register_user(username: str, company: str, email: str, password: str) -> Dict[str, Any]:
    """
    Enregistre un nouvel utilisateur avec mot de passe hashé.
    """
    # vérifier doublons
    check_q = "SELECT id FROM users WHERE username = %s OR email = %s LIMIT 1"
    if run_query(check_q, (username, email), fetch=True):
        return {"success": False, "error": "Nom d'utilisateur ou email déjà utilisé"}
    
    # hasher le mot de passe (bcrypt génère le salt automatiquement)
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    password_hash = bcrypt.hashpw(password_bytes, salt)

    # insérer (bcrypt retourne bytes, MySQL accepte)
    insert_q = "INSERT INTO users (username, company, email, password_hash) VALUES (%s, %s, %s, %s)"
    rowcount = run_query(insert_q, (username, company, email, password_hash), fetch=False)

    if not rowcount or rowcount == 0:
        return {'success': False, 'error': 'Erreur lors de l\'inscription'}
    
    return {'success': True, 'message': 'Utilisateur créé avec succès'}