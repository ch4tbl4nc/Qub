
"""Fonction utilitaire pour exécuter des requêtes SQL dans QUB."""
import mysql.connector
from libs.database.Config import _db_config

def run_query(query, params=None, fetch=False):
    """Exécute une requête SQL et retourne le résultat ou le nombre de lignes affectées."""
    config = _db_config()
    connection = None
    cursor = None
    result = None
    try:
        connection = mysql.connector.connect(**config)
        cursor = connection.cursor()
        cursor.execute(query, params)
        if fetch:
            result = cursor.fetchall()
        else:
            connection.commit()
            result = cursor.rowcount
    except mysql.connector.Error as err:
        print(f"Erreur SQL : {err}")
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
    return result