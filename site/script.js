document.addEventListener('DOMContentLoaded', function () {
  const title = document.getElementById('title');
  const subtitle = document.getElementById('subtitle');
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page');

  if (page === 'connections') {
    title.textContent = 'Connections Archive';
    subtitle.textContent = 'A list of all NYT Connections EVER + all confirmed future ones!';
    fetchSolutions(
      'https://raw.githubusercontent.com/Hamster45105/nyt-games-archive/main/solutions/connections_solutions.json',
      'solutionsTable',
      (data, date) => {
        let solutionHTML = '<ul>';
        for (const category in data[date]) {
          solutionHTML += `<li><strong>${category}</strong><ul>`;
          for (const word of data[date][category]) {
            solutionHTML += `<li>${word}</li>`;
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
        solutionHTML += '<p><strong>Theme Words:</strong></p><ul>';
        for (const word of solution.themeWords) {
          solutionHTML += `<li>${word}</li>`;
        }
        solutionHTML += '</ul>';
        return solutionHTML;
      },
      1
    );
  } else {
    location.href = '?page=wordle';
  }
});

function fetchSolutions(url, tableId, generateSolutionHTML, startNumber) {
  fetch(`${url}?${new Date().getTime()}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const tableBody = document.getElementById(tableId).getElementsByTagName('tbody')[0];
      let i = startNumber;
      for (const date in data) {
        const row = tableBody.insertRow(-1);
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);

        cell1.textContent = i++;
        cell2.textContent = date;

        const solutionHTML = generateSolutionHTML(data, date);

        const solutionDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (solutionDate >= today) {
          const revealButton = document.createElement('button');
          revealButton.className = 'btn btn-primary reveal-btn';
          revealButton.textContent = 'Reveal';
          revealButton.addEventListener('click', function () {
            cell3.innerHTML = solutionHTML;
          });
          cell3.appendChild(revealButton);
        } else {
          cell3.innerHTML = solutionHTML;
        }
      }
    })
    .catch(e => {
      console.error('There was a problem with the fetch operation: ' + e.message);
    });
}

function topFunction() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function bottomFunction() {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}