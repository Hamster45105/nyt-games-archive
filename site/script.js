document.addEventListener('DOMContentLoaded', function () {
  const revealModeSelect = document.getElementById('revealModeSelect');
  if (revealModeSelect) {
    revealModeSelect.value = localStorage.getItem('revealMode') || '2';
    revealModeSelect.addEventListener('change', () => {
      localStorage.setItem('revealMode', revealModeSelect.value);
      location.reload();
    });
  }
  const title = document.getElementById('title');
  const subtitle = document.getElementById('subtitle');
  const notice = document.getElementById('notice');
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page');

  if (page === 'connections') {
    title.textContent = 'Connections Archive';
    subtitle.textContent = 'A list of all NYT Connections EVER + all confirmed future ones!';
    fetchSolutions(
      'https://raw.githubusercontent.com/Hamster45105/nyt-games-archive/main/solutions/connections_solutions.json',
      'solutionsTable',
      (data, date) => {
        let solutionHTML = '<ul style="list-style-type:none; padding-left:0;">';
        for (const category in data[date]) {
          solutionHTML += `<li style="list-style-type:none;"><strong>${category}</strong><ul style="list-style-type:none; padding-left:0;">`;
          for (const word of data[date][category]) {
            solutionHTML += `<li style="list-style-type:none;">${word}</li>`;
          }
          solutionHTML += '</ul></li>';
        }
        solutionHTML += '</ul>';
        return solutionHTML;
      },
      1
    );
  } else if (page === 'wordle') {
    title.textContent = 'Wordle Archive';
    subtitle.textContent = 'A list of all NYT Wordles EVER + all confirmed future ones!';
    fetchSolutions(
      'https://raw.githubusercontent.com/Hamster45105/nyt-games-archive/main/solutions/wordle_solutions.json',
      'solutionsTable',
      (data, date) => data[date],
      0
    );
  } else if (page === 'strands') {
    title.textContent = 'Strands Archive';
    subtitle.textContent = 'A list of all NYT Strands EVER + all confirmed future ones!';
    fetchSolutions(
      'https://raw.githubusercontent.com/Hamster45105/nyt-games-archive/main/solutions/strands_solutions.json',
      'solutionsTable',
      (data, date) => {
        const solution = data[date];
        let solutionHTML = `<p><strong>Clue:</strong> ${solution.clue}</p>`;
        solutionHTML += `<p><strong>Spangram:</strong> ${solution.spangram}</p>`;

        const imageUrl = `https://raw.githubusercontent.com/Hamster45105/nyt-games-archive/main/solutions/strands/${date}.png`;
        solutionHTML += `<div class="mt-3"><a href="${imageUrl}" target="_blank" class="btn btn-success btn-long">View Image</a></div>`;

        solutionHTML += '<p><strong>Theme Words:</strong></p><ul style="list-style-type:none; padding-left:0;">';
        for (const word of solution.themeWords) {
          solutionHTML += `<li style="list-style-type:none;">${word}</li>`;
        }
        solutionHTML += '</ul>';

        solutionHTML += `
          <details>
            <summary><strong>Other Words:</strong></summary>
            <div class="other-words-loading">Loading...</div>
          </details>
        `;

        return solutionHTML;
      },
      1
    );
  } else if (page === 'mini') {
    title.textContent = 'The Mini Archive';
    subtitle.textContent = 'A list of all the NYT "The Mini" Crosswords EVER!';
    notice.textContent = 'Daily solution should be available a few minutes after it is released';
    fetchSolutions(
      'https://raw.githubusercontent.com/Hamster45105/nyt-games-archive/main/solutions/mini_solutions.json',
      'solutionsTable',
      (data, date) => generateMiniHTML(data, date),
      1
    );
  } else {
    location.href = '?page=wordle';
  }
});

function generateMiniHTML(data, date) {
  const solution = data[date];
  let html = `
    <div class="container my-2">
      <div class="row justify-content-center">
        <div class="col-12">
          <div class="mb-2" style="font-size:1.3rem;"><h2><strong>ACROSS</strong></h2></div>
  `;
  for (const key in solution) {
    if (key.endsWith('A')) {
      html += `
        <div class="p-2 border rounded mb-2" style="max-width:400px;margin:auto;">
          <div class="mb-1"><strong>${key.slice(0, -1)}.</strong> ${solution[key].clue}</div>
          <div class="letters d-flex justify-content-center flex-wrap">
      `;
      for (const char of solution[key].answer) {
        html += `<span class="letter-box border rounded text-center m-1" style="width:40px;height:40px;line-height:38px;">${char}</span>`;
      }
      html += `
          </div>
        </div>
      `;
    }
  }
  html += `
          <div class="mb-2 mt-3" style="font-size:1.3rem;"><h2><strong>DOWN</strong></h2></div>
  `;
  for (const key in solution) {
    if (key.endsWith('D')) {
      html += `
        <div class="p-2 border rounded mb-2" style="max-width:400px;margin:auto;">
          <div class="mb-1"><strong>${key.slice(0, -1)}.</strong> ${solution[key].clue}</div>
          <div class="letters d-flex justify-content-center flex-nowrap">
      `;
      for (const char of solution[key].answer) {
        html += `<span class="letter-box border rounded text-center m-1" style="width:40px;height:40px;line-height:38px;">${char}</span>`;
      }
      html += `
          </div>
        </div>
      `;
    }
  }
  html += `
        </div>
      </div>
    </div>
  `;
  return html;
}

function fetchSolutions(url, tableId, generateSolutionHTML, startNumber) {
    document.getElementById('loading').style.display = 'block';

    fetch(`${url}?${new Date().getTime()}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.getElementById(tableId).getElementsByTagName('tbody')[0];
            const reversedDates = Object.keys(data).sort((a, b) => new Date(b) - new Date(a));
            let rowNumber = startNumber + reversedDates.length - 1;
            const revealMode = localStorage.getItem('revealMode') || '2';

            const batchSize = 50;
            let currentIndex = 0;

            function loadBatch() {
                for (let count = 0; count < batchSize && currentIndex < reversedDates.length; count++, currentIndex++) {
                    const date = reversedDates[currentIndex];
                    const row = tableBody.insertRow(-1);
                    const cell1 = row.insertCell(0);
                    const cell2 = row.insertCell(1);
                    const cell3 = row.insertCell(2);

                    // Adjusted column widths:
                    cell1.style.width = "10%";  // Number column
                    cell2.style.width = "40%";  // Date column
                    cell3.style.width = "50%";  // Solutions column

                    cell1.textContent = rowNumber--;
                    cell2.textContent = date;

                    const solutionHTML = generateSolutionHTML(data, date);
                    const solutionDate = new Date(date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    if (revealMode === '1') {
                        // Always hide behind Reveal button
                        const revealButton = document.createElement('button');
                        revealButton.className = 'btn btn-primary reveal-btn';
                        revealButton.textContent = 'Reveal';
                        revealButton.addEventListener('click', function () {
                            cell3.innerHTML = solutionHTML;
                            addDetailsEventListeners(cell3, data[date]);
                        });
                        cell3.appendChild(revealButton);
                    } else if (revealMode === '2') {
                        // Hide if solution date is today or in the future
                        if (solutionDate >= today) {
                            const revealButton = document.createElement('button');
                            revealButton.className = 'btn btn-primary reveal-btn';
                            revealButton.textContent = 'Reveal';
                            revealButton.addEventListener('click', function () {
                                cell3.innerHTML = solutionHTML;
                                addDetailsEventListeners(cell3, data[date]);
                            });
                            cell3.appendChild(revealButton);
                        } else {
                            cell3.innerHTML = solutionHTML;
                            addDetailsEventListeners(cell3, data[date]);
                        }
                    } else if (revealMode === '3') {
                        // Always show
                        cell3.innerHTML = solutionHTML;
                        addDetailsEventListeners(cell3, data[date]);
                    }
                }
            }

            // Load the initial batch of solutions.
            loadBatch();

            // Attach scroll listener to load more rows dynamically.
            function onScroll() {
                if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
                    loadBatch();
                    if (currentIndex >= reversedDates.length) {
                        window.removeEventListener('scroll', onScroll);
                    }
                }
            }
            window.addEventListener('scroll', onScroll);

            // Expose a helper function so bottomFunction can load all remaining rows immediately.
            window.loadAllRemainingSolutions = function() {
                while (currentIndex < reversedDates.length) {
                    loadBatch();
                }
                window.removeEventListener('scroll', onScroll);
            };
        })
        .catch(e => {
            console.error('There was a problem with the fetch operation: ' + e.message);
        })
        .finally(() => {
            document.getElementById('loading').style.display = 'none';
        });
}

function addDetailsEventListeners(cell, solution) {
  const details = cell.querySelector('details');
  if (details) {
    details.addEventListener('toggle', function () {
      if (details.open) {
        const summary = details.querySelector('summary');
        summary.innerHTML = `<strong>Other Words</strong> (${solution.otherWords.length})`;

        const loadingDiv = details.querySelector('.other-words-loading');
        let otherWordsHTML = '<ul style="list-style-type:none; padding-left:0;">';
        for (const word of solution.otherWords) {
          otherWordsHTML += `<li style="list-style-type:none;">${word}</li>`;
        }
        otherWordsHTML += '</ul>';
        loadingDiv.innerHTML = otherWordsHTML;
      }
    }, { once: true });
  }
}

function topFunction() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function bottomFunction() {
  if (window.loadAllRemainingSolutions) {
      window.loadAllRemainingSolutions();
  }
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function scrollToDate() {
  // Show the date modal using Bootstrap's modal API
  const dateModalElement = document.getElementById('dateModal');
  const dateModal = new bootstrap.Modal(dateModalElement);
  dateModal.show();

  // Once the "Go" button is clicked, attempt to scroll to the matching date
  document.getElementById('goToDateBtn').addEventListener('click', function () {
    const dateInput = document.getElementById('datePicker').value;
    if (!dateInput) {
      alert("Please select a date!");
      return;
    }

    // Ensure all rows are loaded
    if (typeof window.loadAllRemainingSolutions === 'function') {
      window.loadAllRemainingSolutions();
    }

    // Search through the table for a matching date (assumes second cell contains the date)
    const tableBody = document.getElementById('solutionsTable').getElementsByTagName('tbody')[0];
    const rows = tableBody.getElementsByTagName('tr');
    let found = false;
    for (let row of rows) {
      const cellDate = row.cells[1].textContent.trim();
      if (cellDate === dateInput) {
        row.scrollIntoView({ behavior: 'smooth' });
        found = true;
        break;
      }
    }
    if (!found) {
      alert("Date not found!");
    } else {
      dateModal.hide();
    }
  });
}