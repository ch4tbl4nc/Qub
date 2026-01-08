
"""Modification d'une ligne d'un fichier CSV pour QUB."""
import pandas as pd

def edit_csv(file_path, index, name, data):
    """Modifie une ligne d'un fichier CSV et retourne 'Success'."""
    df = pd.read_csv(file_path)
    df.loc[index, name] = data
    df.to_csv(file_path, index=False)
    return "Success"