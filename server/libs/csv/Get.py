
"""Récupération d'une ligne d'un fichier CSV pour QUB."""
import pandas as pd

def get_csv(file_path, index):
    """Récupère une ligne d'un fichier CSV et la retourne sous forme de dictionnaire."""
    df = pd.read_csv(file_path)
    return df.loc[index]