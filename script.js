function fetchSolutions(url, tableId, generateSolutionHTML, startNumber) {
  fetch(`${url}?${new Date().getTime()}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const table = document.getElementById(tableId).getElementsByTagName('tbody')[0];
      let i = startNumber;
      for (const date in data) {
        const row = table.insertRow(-1);
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);

        // Apply CSS styles to the cells
        cell1.style.width = '10%';
        cell1.style.whiteSpace = 'nowrap';
        cell2.style.width = '20%'; 
        cell2.style.whiteSpace = 'nowrap';
        cell3.style.width = '70%';
        cell3.style.whiteSpace = 'normal';

        cell1.innerHTML = i++;
        cell2.innerHTML = date;

        const solutionHTML = generateSolutionHTML(data, date);

        // Check if the date is today's date or a future date
        const solutionDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (solutionDate >= today) {
          // If the date is today's date or a future date, hide the solution and add a button to reveal the solution
          cell3.innerHTML = `<button class="btn btn-primary" style="white-space: nowrap; padding: 0.375rem 0.75rem; width: 100px;" onclick="this.parentNode.innerHTML='${solutionHTML}'">Reveal</button>`;
        } else {
          // If the date is a past date, show the solution
          cell3.innerHTML = solutionHTML;
        }
      }
    })
    .catch(e => {
      console.log('There was a problem with the fetch operation: ' + e.message);
    });
}