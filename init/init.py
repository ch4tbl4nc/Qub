
"""Initialisation de la base de données QUB."""
import os
from dotenv import load_dotenv
import mysql.connector

load_dotenv()

def main():
    """Exécute les scripts SQL d'initialisation."""
    conn = mysql.connector.connect(**{
        'user': os.environ.get('DB_USER'),
        'password': os.environ.get('DB_PASS'),
        'host': os.environ.get('DB_HOST'),
        'port': os.environ.get('DB_PORT'),
        'database': os.environ.get('DB_NAME'),
        'raise_on_warnings': True
    })
    cursor = conn.cursor()
    files = os.listdir('init')
    for fname in files:
        if fname.endswith('.sql'):
            try:
                with open(f'init/{fname}', 'r', encoding='utf-8') as sql_file:
                    sql_commands = sql_file.read().split(';')
                    for command in sql_commands:
                        if command.strip():
                            cursor.execute(command)
                conn.commit()
            except mysql.connector.Error as err:
                print(f"Error: {err}")
    conn.close()

if __name__ == "__main__":
    main()