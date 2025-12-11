
import pandas as pd

def drop_csv(file_path, index):
    """Drop a CSV row and returns its content as a list of dictionaries."""

    df = pd.read_csv(file_path)

    df = df.drop(df.index[index])
    df.to_csv(file_path, index=False)
    
    return "Success"