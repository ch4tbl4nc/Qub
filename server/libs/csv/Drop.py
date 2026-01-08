
"""Suppression d'une ligne d'un fichier CSV pour QUB."""
import pandas as pd

def drop_csv(file_path, index):
    """Supprime une ligne d'un fichier CSV et retourne 'Success'."""
    df = pd.read_csv(file_path)
    df = df.drop(df.index[index])
    df.to_csv(file_path, index=False)
    return "Success"