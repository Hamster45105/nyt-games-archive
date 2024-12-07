from datetime import date, timedelta
import json
import requests
import threading

# Initialize solutions as empty dictionaries
wordle_solutions = {}
connections_solutions = {}
strands_solutions = {}

# Function to fetch Wordle solutions
def fetch_wordle_solutions():
    start_date = date(2021, 6, 19)
    delta = timedelta(days=1)
    while True:
        input_date = start_date.strftime('%Y-%m-%d')
        try:
            response = requests.get(f'https://www.nytimes.com/svc/wordle/v2/{input_date}.json')
            solution = response.json()['solution']
            wordle_solutions[input_date] = solution
            print(f'Fetched Wordle solution for {input_date}')
            start_date += delta
        except KeyError:
            print('No more Wordle solutions')
            break
        except Exception as e:
            print(f'Error fetching Wordle solution for {input_date}: {e}')
            break
    # Save Wordle solutions to a local JSON file
    with open('./solutions/wordle_solutions.json', 'w', encoding='utf-8') as f:
        json.dump(wordle_solutions, f, indent=4)
        f.write('\n')

# Function to fetch Connections solutions
def fetch_connections_solutions():
    start_date = date(2023, 6, 12)
    delta = timedelta(days=1)
    while True:
        input_date = start_date.strftime('%Y-%m-%d')
        try:
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
            start_date += delta
        except KeyError:
            print('No more Connections solutions')
            break
        except Exception as e:
            print(f'Error fetching Connections solution for {input_date}: {e}')
            break
    # Save Connections solutions to a local JSON file
    with open('./solutions/connections_solutions.json', 'w', encoding='utf-8') as f:
        json.dump(connections_solutions, f, indent=4)
        f.write('\n')

# Function to fetch Strands solutions
def fetch_strands_solutions():
    start_date = date(2024, 3, 4)
    delta = timedelta(days=1)
    while True:
        input_date = start_date.strftime('%Y-%m-%d')
        try:
            response = requests.get(f'https://www.nytimes.com/svc/strands/v2/{input_date}.json')
            data = response.json()
            solution = {
                'clue': data['clue'],
                'spangram': data['spangram'],
                'themeWords': data['themeWords']
            }
            strands_solutions[input_date] = solution
            print(f'Fetched Strands solution for {input_date}')
            start_date += delta
        except KeyError:
            print('No more Strands solutions')
            break
        except Exception as e:
            print(f'Error fetching Strands solution for {input_date}: {e}')
            break
    # Save Strands solutions to a local JSON file
    with open('./solutions/strands_solutions.json', 'w', encoding='utf-8') as f:
        json.dump(strands_solutions, f, indent=4)
        f.write('\n')

# Create threads for each fetching function
wordle_thread = threading.Thread(target=fetch_wordle_solutions)
connections_thread = threading.Thread(target=fetch_connections_solutions)
strands_thread = threading.Thread(target=fetch_strands_solutions)

# Start the threads
wordle_thread.start()
connections_thread.start()
strands_thread.start()

# Wait for all threads to complete
wordle_thread.join()
connections_thread.join()
strands_thread.join()
