import threading
from datetime import date, timedelta
import json
import requests
from recreate_strands import recreate_board

# Initialize solutions as empty dictionaries
wordle_solutions = {}
connections_solutions = {}
strands_solutions = {}

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

# Function to fetch Strands solution
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
        recreate_board(response.json(), output_file=f'./solutions/strands/{input_date}.png')
        print(f'Fetched Strands solution for {input_date}')

# Start dates
wordle_start_date = date(2021, 6, 19)
connections_start_date = date(2023, 6, 12)
strands_start_date = date(2024, 3, 4)
delta = timedelta(days=1)

# Fetch functions for threading
def fetch_all_wordle_solutions():
    current_date = wordle_start_date
    while True:
        try:
            fetch_wordle_solution(current_date.strftime('%Y-%m-%d'))
            current_date += delta
        except KeyError:
            print('No more Wordle solutions')
            break

def fetch_all_connections_solutions():
    current_date = connections_start_date
    while True:
        try:
            fetch_connections_solution(current_date.strftime('%Y-%m-%d'))
            current_date += delta
        except KeyError:
            print('No more Connections solutions')
            break

def fetch_all_strands_solutions():
    current_date = strands_start_date
    while True:
        try:
            fetch_strands_solution(current_date.strftime('%Y-%m-%d'))
            current_date += delta
        except KeyError:
            print('No more Strands solutions')
            break

# Create threads
threads = []
threads.append(threading.Thread(target=fetch_all_wordle_solutions))
threads.append(threading.Thread(target=fetch_all_connections_solutions))
threads.append(threading.Thread(target=fetch_all_strands_solutions))

# Start threads
for thread in threads:
    thread.start()

# Wait for all threads to finish
for thread in threads:
    thread.join()

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
