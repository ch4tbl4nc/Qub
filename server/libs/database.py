# database.py
import mysql.connector

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

def run_query(query, params=None, fetch=False):
    """
    Fonction unique pour se connecter, exécuter et fermer.
    """
    config = _db_config()
    connection = None
    cursor = None
    result = None

    try:
        # Connexion
        connection = mysql.connector.connect(**config)
        
        # Preparation (Security)
        cursor = connection.cursor(prepared=True)
        cursor.execute(query, params)

        # Result handling
        if fetch:
            result = cursor.fetchall()
        else:
            connection.commit()
            result = cursor.rowcount 

    #Error handling
    except mysql.connector.Error as err:
        print(f"Erreur SQL : {err}")

    # Cleanup
    finally:
        if cursor: cursor.close()
        if connection: connection.close()
    
    return result