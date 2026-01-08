
"""Configuration de la base de données pour QUB."""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Charger le .env depuis le bon chemin (compatible PyInstaller)
if getattr(sys, 'frozen', False):
    base_path = Path(sys._MEIPASS)
else:
    base_path = Path(__file__).parent.parent.parent

env_file = base_path / '.env'
if env_file.exists():
    load_dotenv(env_file)
else:
    load_dotenv()

def _db_config():
    """Retourne la configuration de connexion MySQL depuis les variables d'environnement."""
    return {
        'user': os.environ.get('DB_USER', 'root'),
        'password': os.environ.get('DB_PASS', ''),
        'host': os.environ.get('DB_HOST', '127.0.0.1'),
        'port': int(os.environ.get('DB_PORT', '3306')),
        'database': os.environ.get('DB_NAME', 'qub_db'),
        'raise_on_warnings': True
    }
