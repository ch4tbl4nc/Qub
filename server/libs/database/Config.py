
import os
from dotenv import load_dotenv

load_dotenv()

def _db_config():
    """Configuration de la base de données. !!! POUR DEV SINON UTILISER DES VARIABLES D'ENVIRONNEMENT !!!"""
    return {
        'user': os.environ.get('DB_USER'),
        'password': os.environ.get('DB_PASS'),
        'host': os.environ.get('DB_HOST'),
        'port': os.environ.get('DB_PORT'),
        'database': os.environ.get('DB_NAME'),
        'raise_on_warnings': True
    }
