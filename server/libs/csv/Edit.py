
import csv

def read_csv(file_path):
    """Edit a CSV file and returns its content as a list of dictionaries."""

    with open(file_path, mode='r', newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        return [row for row in reader]