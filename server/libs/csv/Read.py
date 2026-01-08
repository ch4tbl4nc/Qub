
"""Lecture d'un fichier CSV pour QUB."""
import pandas as pd

def read_csv(file_path):
    """Lit un fichier CSV et retourne son contenu sous forme de liste de dictionnaires."""
    df = pd.read_csv(file_path).to_dict()
    products = []
    for i, name in enumerate(df['product_name']):
        products.append({
            'product_id': i,
            'product_name': df['product_name'][i],
        })
    return products