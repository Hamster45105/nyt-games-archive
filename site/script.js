document.addEventListener('DOMContentLoaded', function () {
  const title = document.getElementById('title');
  const subtitle = document.getElementById('subtitle');
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page');

  const headerRow = document.getElementById('tableHeader');

  if (page === 'connections') {
    title.textContent = 'Connections Archive';
    subtitle.textContent = 'A list of all NYT Connections EVER + all confirmed future ones!';

    // Generate table headers with "No." column
    headerRow.innerHTML = `
      <th scope="col">No.</th>
      <th scope="col">Date</th>
      <th scope="col">Solution</th>
    `;

    fetchSolutions(
      'https://raw.githubusercontent.com/Hamster45105/nyt-games-archive/main/solutions/connections_solutions.json',
      'solutionsTable',
      generateConnectionsSolutionHTML,
      1,
      true // Include "No." column
    );
  } else if (page === 'wordle') {
    title.textContent = 'Wordle Archive';
    subtitle.textContent = 'A list of all NYT Wordles EVER + all confirmed future ones!';

    headerRow.innerHTML = `
      <th scope="col">No.</th>
      <th scope="col">Date</th>
      <th scope="col">Solution</th>
    `;

    fetchSolutions(
      'https://raw.githubusercontent.com/Hamster45105/nyt-games-archive/main/solutions/wordle_solutions.json',
      'solutionsTable',
      (data, date) => data[date],
      0,
      true // Include "No." column
    );
  } else if (page === 'strands') {
    title.textContent = 'Strands Archive';
    subtitle.textContent = 'A list of all NYT Strands EVER + all confirmed future ones!';

    // Generate table headers without "No." column
    headerRow.innerHTML = `
      <th scope="col">Date</th>
      <th scope="col">Solution</th>
    `;

    fetchSolutions(
      'https://raw.githubusercontent.com/Hamster45105/nyt-games-archive/main/solutions/strands_solutions.json',
      'solutionsTable',
      generateStrandsSolutionHTML,
      0,
      false // Exclude "No." column
    );
  } else {
    location.href = '?page=wordle';
  }
});

function generateConnectionsSolutionHTML(data, date) {
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
}

function generateStrandsSolutionHTML(data, date) {
  const solutionData = data[date];
  let solutionHTML = `<p><strong>Clue:</strong> ${solutionData.clue}</p>`;
  solutionHTML += `<p><strong>Spangram:</strong> <span class="spangram">${solutionData.spangram}</span></p>`;
  solutionHTML += `<p class="text-center"><strong>Theme Words:</strong></p>`;
  solutionHTML += '<ul>';
  for (const word of solutionData.themeWords) {
    solutionHTML += `<li>${word}</li>`;
  }
  solutionHTML += '</ul>';
  return solutionHTML;
}

// Function to fetch and display solutions
function fetchSolutions(url, tableId, generateSolutionHTML, startIndex, includeNoColumn) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const table = document.getElementById(tableId);
      let index = startIndex;
      for (const date in data) {
        const row = table.insertRow();
        if (includeNoColumn) {
          const cellNo = row.insertCell();
          cellNo.textContent = index++;
        }
        const cellDate = row.insertCell();
        cellDate.textContent = date;
        const cellSolution = row.insertCell();
        cellSolution.innerHTML = generateSolutionHTML(data, date);
      }
    })
    .catch(error => console.error('Error fetching solutions:', error));
}

function bottomFunction() {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function topFunction() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}