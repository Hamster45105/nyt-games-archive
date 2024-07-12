from datetime import date, timedelta
import json
import os

import requests

# Initialize Wordle solutions as an empty dictionary
wordle_solutions = {}

# Load existing solutions if wordle_solutions.json exists
if os.path.exists('./solutions/wordle_solutions.json'):
    with open('./solutions/wordle_solutions.json', 'r', encoding='utf-8') as f:
        wordle_solutions = json.load(f)

# Function to fetch Wordle solution
def fetch_wordle_solution(input_date):
    if input_date not in wordle_solutions:
        response = requests.get(f'https://www.nytimes.com/svc/wordle/v2/{input_date}.json')
        solution = response.json()['solution']
        wordle_solutions[input_date] = solution
        print(f'Fetched Wordle solution for {input_date}')

# Fetch Wordle solutions from 2021-06-19 until there are no more
start_date = date(2021, 6, 19)
delta = timedelta(days=1)

while True:
    try:
        fetch_wordle_solution(start_date.strftime('%Y-%m-%d'))
        start_date += delta
    except KeyError:
        print(f'No more Wordle solutions')
        break

# Save Wordle solutions to a local JSON file
with open('./solutions/wordle_solutions.json', 'w') as f:
    json.dump(wordle_solutions, f)