from datetime import date, timedelta
import json
import os
import requests

# Initialize solutions as empty dictionaries
wordle_solutions = {}
connections_solutions = {}

# Load existing Wordle solutions if wordle_solutions.json exists
if os.path.exists('./solutions/wordle_solutions.json'):
    with open('./solutions/wordle_solutions.json', 'r', encoding='utf-8') as f:
        wordle_solutions = json.load(f)

# Load existing Connections solutions if connections_solutions.json exists
if os.path.exists('./solutions/connections_solutions.json'):
    with open('./solutions/connections_solutions.json', 'r', encoding='utf-8') as f:
        connections_solutions = json.load(f)

# Function to fetch Wordle solution
def fetch_wordle_solution(input_date):
    if input_date not in wordle_solutions:
        response = requests.get(f'https://www.nytimes.com/svc/wordle/v2/{input_date}.json')
        solution = response.json()['solution']
        wordle_solutions[input_date] = solution
        print(f'Fetched Wordle solution for {input_date}')

# Function to fetch Connections solution
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
        print(f'Fetched Connections solution for {input_date}')

# Fetch solutions from start date
wordle_start_date = date(2021, 6, 19)
connections_start_date = date(2023, 6, 12)
delta = timedelta(days=1)

while True:
    try:
        fetch_wordle_solution(wordle_start_date.strftime('%Y-%m-%d'))
        wordle_start_date += delta
    except KeyError:
        print('No more Wordle solutions')
        break

while True:
    try:
        fetch_connections_solution(connections_start_date.strftime('%Y-%m-%d'))
        connections_start_date += delta
    except KeyError:
        print('No more Connections solutions')
        break

# Save Wordle solutions to a local JSON file
with open('./solutions/wordle_solutions.json', 'w', encoding='utf-8') as f:
    json.dump(wordle_solutions, f, indent=4)

# Save Connections solutions to a local JSON file
with open('./solutions/connections_solutions.json', 'w', encoding='utf-8') as f:
    json.dump(connections_solutions, f, indent=4)