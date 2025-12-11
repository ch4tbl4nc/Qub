
import pandas as pd

def edit_csv(file_path, index, name, data):
    """Edit a CSV row file and returns its content as a list of dictionaries."""

    df = pd.read_csv(file_path)

    df.loc[index, name] = data
    df.to_csv(file_path, index=False)
        
    return "Success"