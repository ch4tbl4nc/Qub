
"""Configuration de la base de données pour QUB."""
import os
from dotenv import load_dotenv

load_dotenv()

def _db_config():
    """Retourne la configuration de connexion MySQL depuis les variables d'environnement."""
    return {
        'user': os.environ.get('DB_USER'),
        'password': os.environ.get('DB_PASS'),
        'host': os.environ.get('DB_HOST'),
        'port': os.environ.get('DB_PORT'),
        'database': os.environ.get('DB_NAME'),
        'raise_on_warnings': True
    }
