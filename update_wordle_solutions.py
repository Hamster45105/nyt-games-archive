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
def fetch_wordle_solution(date):
    if date not in wordle_solutions:
        response = requests.get(f'https://www.nytimes.com/svc/wordle/v2/{date}.json')
        solution = response.json()['solution']
        wordle_solutions[date] = solution
        print(f'Fetched Wordle solution for {date}')

# Fetch Wordle solutions from 2021-06-19 to current day plus 25 days
start_date = date(2021, 6, 19)
end_date = date.today() + timedelta(days=25)
delta = timedelta(days=1)
while start_date <= end_date:
    fetch_wordle_solution(start_date.strftime('%Y-%m-%d'))
    start_date += delta

# Save Wordle solutions to a local JSON file
with open('./solutions/wordle_solutions.json', 'w') as f:
    json.dump(wordle_solutions, f)