import mysql.connector
from mysql.connector import errorcode
from urllib.parse import urlparse

class MySQLDatabase:
    def __init__(self, connection_url=None, config_dict=None):
        """
        Initialise la configuration.
        On peut passer soit une URL de connexion, soit un dictionnaire config.
        """
        self.connection = None
        self.config = {}

        if connection_url:
            self.config = self._parse_url(connection_url)
        elif config_dict:
            self.config = config_dict
        else:
            raise ValueError("Vous devez fournir une URL ou un dictionnaire de configuration.")

    @staticmethod
    def _parse_url(url):
        """Transforme une URL mysql:// en dictionnaire compatible."""
        parsed = urlparse(url)
        return {
            'user': parsed.username,
            'password': parsed.password,
            'host': parsed.hostname,
            'port': parsed.port or 3306,
            'database': parsed.path.lstrip('/'),
            'raise_on_warnings': True
        }

    def __enter__(self):
        """Permet l'utilisation du mot clé 'with'"""
        try:
            self.connection = mysql.connector.connect(**self.config)
            return self
        except mysql.connector.Error as err:
            if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
                print("Erreur : Nom d'utilisateur ou mot de passe incorrect.")
            elif err.errno == errorcode.ER_BAD_DB_ERROR:
                print("Erreur : La base de données n'existe pas.")
            else:
                print(f"Erreur : {err}")
            raise

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Ferme la connexion automatiquement à la fin du bloc 'with'"""
        if self.connection and self.connection.is_connected():
            self.connection.close()

    def execute_secure_query(self, query, params=None, fetch=False):
        """
        Exécute une requête préparée sécurisée.
        
        Args:
            query (str): La requête SQL avec les placeholders %s
            params (tuple): Les variables à injecter (sécurité anti-injection)
            fetch (bool): True pour un SELECT, False pour INSERT/UPDATE/DELETE
        """
        # prepared=True active les vrais Prepared Statements côté serveur (plus performant et strict)
        cursor = self.connection.cursor(prepared=True)
        try:
            # L'étape cruciale : execute() combine PREPARE et EXECUTE
            cursor.execute(query, params)
            
            if fetch:
                result = cursor.fetchall()
                return result
            else:
                self.connection.commit()
                return cursor.rowcount
        except mysql.connector.Error as err:
            print(f"Erreur lors de l'exécution : {err}")
            self.connection.rollback()
            return None
        finally:
            cursor.close()

# --- Exemple d'utilisation ---

# Configuration via URL (comme demandé)
db_url = "mysql://mon_user:mon_motdepasse@localhost:3306/ma_bdd"

# Utilisation du Context Manager
try:
    with MySQLDatabase(connection_url=db_url) as db:
        
        # 1. Exemple INSERT (Sécurisé)
        sql_insert = "INSERT INTO utilisateurs (nom, email, age) VALUES (%s, %s, %s)"
        # Note : Toujours utiliser un tuple pour les params
        user_data = ("Dupont", "jean.dupont@email.com", 30) 
        
        rows_affected = db.execute_secure_query(sql_insert, user_data)
        print(f"Utilisateur ajouté. Lignes affectées : {rows_affected}")

        # 2. Exemple SELECT (Sécurisé)
        sql_select = "SELECT id, nom, email FROM utilisateurs WHERE age > %s"
        age_limit = (25,) # Tuple d'un seul élément
        
        users = db.execute_secure_query(sql_select, age_limit, fetch=True)
        
        print("\n--- Liste des utilisateurs ---")
        if users:
            for user in users:
                print(f"ID: {user[0]}, Nom: {user[1]}, Email: {user[2]}")

except Exception as e:
    print(f"Arrêt du script suite à une erreur critique : {e}")