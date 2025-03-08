// Set default date to today
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('mealDate');
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');
    dateInput.value = `${year}-${month}-${day}`;
});




// Add an event listener for form submission
document.getElementById('mealForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  // Get meal description and date (if needed)
  const mealDesc = document.getElementById('mealDesc').value;
  const mealDate = document.getElementById('mealDate').value; // not used in this example but available

  // Clear previous results and show loading message
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = "<p>Loading nutrition data...</p>";

  try {
    // Call the serverless function endpoint (ensure the path matches your deployment)
    const response = await fetch('/.netlify/functions/nutrinx', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: mealDesc })
    });
    
    const result = await response.json();
    
    // If an error is returned, display it
    if (result.error) {
      resultDiv.innerHTML = `<p>Error: ${result.error}</p>`;
      return;
    }
    
    // Build HTML for aggregated totals
    let html = `<h2>Aggregated Nutrition Data</h2>`;
    html += `<p><strong>Calories:</strong> ${result.totals.nf_calories.toFixed(1)}</p>`;
    html += `<p><strong>Total Fat:</strong> ${result.totals.nf_total_fat.toFixed(1)} g</p>`;
    html += `<p><strong>Carbohydrates:</strong> ${result.totals.nf_total_carbohydrate.toFixed(1)} g</p>`;
    html += `<p><strong>Protein:</strong> ${result.totals.nf_protein.toFixed(1)} g</p>`;
    
    // Build HTML for individual food items in a table
    html += `<h2>Individual Food Items</h2>`;
    html += `<table border="1" cellpadding="5" cellspacing="0">
               <thead>
                 <tr>
                   <th>Food Name</th>
                   <th>Calories</th>
                   <th>Total Fat (g)</th>
                   <th>Carbohydrates (g)</th>
                   <th>Protein (g)</th>
                 </tr>
               </thead>
               <tbody>`;
    result.individual.forEach(food => {
      html += `<tr>
                 <td>${food.food_name}</td>
                 <td>${food.nf_calories.toFixed(1)}</td>
                 <td>${food.nf_total_fat.toFixed(1)}</td>
                 <td>${food.nf_total_carbohydrate.toFixed(1)}</td>
                 <td>${food.nf_protein.toFixed(1)}</td>
               </tr>`;
    });
    html += `</tbody></table>`;
    
    // Display the final HTML in the result container
    resultDiv.innerHTML = html;
  } catch (error) {
    resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
  }
});
