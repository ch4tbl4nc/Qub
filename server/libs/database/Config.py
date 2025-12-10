
def _db_config():
    """Configuration de la base de données. !!! POUR DEV SINON UTILISER DES VARIABLES D'ENVIRONNEMENT !!!"""
    return {
        'user': 'qubAdmin',
        'password': '5c8e1c1e7b91ac191454',
        'host': 'panel.lemecha.fr',
        'port': 3309,
        'database': 'qub',
        'raise_on_warnings': True
    }
