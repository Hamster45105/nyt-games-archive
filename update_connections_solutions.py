from datetime import date, timedelta
import json
import os

import requests

# Initialize connections solutions as an empty dictionary
connections_solutions = {}

# Load existing solutions if connections_solutions.json exists
if os.path.exists('./solutions/connections_solutions.json'):
    with open('./solutions/connections_solutions.json', 'r', encoding='utf-8') as f:
        connections_solutions = json.load(f)

# Function to fetch connections solution
def fetch_connections_solution(input_date):
    if input_date not in connections_solutions:
        response = requests.get(f'https://www.nytimes.com/svc/connections/v2/{input_date}.json')
        data = response.json()
        solution = {}
        categories = data['categories']
        for category in categories:
            title = category['title']
            cards = category['cards']
            words = [card['content'] for card in cards]
            solution[title] = words
        connections_solutions[input_date] = solution
        print(f'Fetched connections solution for {input_date}')

# Fetch connections solutions from 2021-06-19 until there are no more
start_date = date(2023, 6, 12)
delta = timedelta(days=1)

while True:
    try:
        fetch_connections_solution(start_date.strftime('%Y-%m-%d'))
        start_date += delta
    except KeyError:
        print(f'No more connections solutions')
        break

# Save connections solutions to a local JSON file
with open('./solutions/connections_solutions.json', 'w') as f:
    json.dump(connections_solutions, f)