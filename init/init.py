
import os
import mysql.connector

import os
from dotenv import load_dotenv

load_dotenv()

# Connect to database
conn = mysql.connector.connect(**{
        'user': os.environ.get('DB_USER'),
        'password': os.environ.get('DB_PASS'),
        'host': os.environ.get('DB_HOST'),
        'port': os.environ.get('DB_PORT'),
        'database': os.environ.get('DB_NAME'),
        'raise_on_warnings': True}
    )
cursor = conn.cursor()

files = os.listdir('init')

for f in files:
    if f.endswith('.sql'):
        # Read and execute SQL file
        try:
            with open('init/' + f, 'r') as sql_file:
                sql_commands = sql_file.read().split(';')
                for command in sql_commands:
                    if command.strip():
                        cursor.execute(command)

            conn.commit()
            conn.close()
        except mysql.connector.Error as err:
            print(f"Error: {err}")


        