
from libs.database.Config import _db_config
import mysql.connector

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
        cursor = connection.cursor()
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