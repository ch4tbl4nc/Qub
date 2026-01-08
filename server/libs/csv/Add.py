
"""Ajout d'une ligne à un fichier CSV pour QUB."""
import pandas as pd

def add_csv(file_path, data):
    """Ajoute une ligne à un fichier CSV et retourne 'Success'."""
    df = pd.read_csv(file_path)
    index = len(df)
    for key in data.keys():
        df.loc[index, key] = data[key]
    df.to_csv(file_path, index=False)
    return "Success"