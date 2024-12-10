from datetime import date, timedelta
import json
import os
import requests

# Initialize solutions as empty dictionaries
wordle_solutions = {}
connections_solutions = {}
strands_solutions = {}

# Function to fetch Wordle solutions
def fetch_wordle_solution(input_date):
    if input_date not in wordle_solutions:
        response = requests.get(f'https://www.nytimes.com/svc/wordle/v2/{input_date}.json')
        solution = response.json()['solution']
        wordle_solutions[input_date] = solution
        print(f'Fetched Wordle solution for {input_date}')

# Function to fetch Connections solutions
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

# Function to fetch Strands solutions
def fetch_strands_solution(input_date):
    if input_date not in strands_solutions:
        response = requests.get(f'https://www.nytimes.com/svc/strands/v2/{input_date}.json')
        data = response.json()
        solution = {
            'clue': data['clue'],
            'spangram': data['spangram'],
            'themeWords': data['themeWords']
        }
        strands_solutions[input_date] = solution
        print(f'Fetched Strands solution for {input_date}')

# Start dates
wordle_start_date = date(2021, 6, 19)
connections_start_date = date(2023, 6, 12)
strands_start_date = date(2024, 3, 4)
delta = timedelta(days=1)

# Fetch Wordle solutions
while True:
    try:
        fetch_wordle_solution(wordle_start_date.strftime('%Y-%m-%d'))
        wordle_start_date += delta
    except KeyError:
        print('No more Wordle solutions')
        break

# Fetch Connections solutions
while True:
    try:
        fetch_connections_solution(connections_start_date.strftime('%Y-%m-%d'))
        connections_start_date += delta
    except KeyError:
        print('No more Connections solutions')
        break

# Fetch Strands solutions
while True:
    try:
        fetch_strands_solution(strands_start_date.strftime('%Y-%m-%d'))
        strands_start_date += delta
    except KeyError:
        print('No more Strands solutions')
        break

# Save Wordle solutions to a local JSON file
with open('./solutions/wordle_solutions.json', 'w', encoding='utf-8') as f:
    json.dump(wordle_solutions, f, indent=4)
    f.write('\n')

# Save Connections solutions to a local JSON file
with open('./solutions/connections_solutions.json', 'w', encoding='utf-8') as f:
    json.dump(connections_solutions, f, indent=4)
    f.write('\n')

# Save Strands solutions to a local JSON file
with open('./solutions/strands_solutions.json', 'w', encoding='utf-8') as f:
    json.dump(strands_solutions, f, indent=4)
    f.write('\n')
