
import pandas as pd

def add_csv(file_path, data):
    """Add a CSV row and returns its content as a list of dictionaries."""

    df = pd.read_csv(file_path)
    index = len(df)


    for key in data.keys():
        df.loc[index, key] = data[key]
        
    df.to_csv(file_path, index=False)
    return "Success"