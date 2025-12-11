
import pandas as pd

def read_csv(file_path):
    """Reads a CSV file and returns its content as a list of dictionaries."""

    df = pd.read_csv(file_path).to_dict()

    products = []
    for i in range(len(df['product_name'])):
        products.append({
            'product_id': i,
            'product_name': df['product_name'][i],
            })
        
    return products