
import pandas as pd

def get_csv(file_path, index):
    """Get a CSV row in file and returns its content as a list of dictionaries."""

    df = pd.read_csv(file_path)
        
    return df.loc[index]