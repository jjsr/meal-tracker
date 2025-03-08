// Set default date to today
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('mealDate');
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');
    dateInput.value = `${year}-${month}-${day}`;
});




// Listen for form submission
document.getElementById('mealForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const mealDesc = document.getElementById('mealDesc').value;
  const resultDiv = document.getElementById('result');
  
  // Clear previous results and show a loading message
  resultDiv.innerHTML = "<p>Loading nutrition data...</p>";

  try {
    // Call your serverless endpoint (adjust URL as needed)
    const response = await fetch('/.netlify/functions/nutrinx', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: mealDesc })
    });
    
    // Check if response has a valid JSON Content-Type
    const contentType = response.headers.get("Content-Type") || "";
    let result;
    if (contentType.includes("application/json")) {
      try {
        result = await response.json();
      } catch (e) {
        throw new Error("Invalid JSON response");
      }
    } else {
      // If not JSON, throw an error with the text response for debugging
      const text = await response.text();
      throw new Error("Expected JSON but received: " + text);
    }
    
    // Check for errors in the response result
    if (result.error) {
      resultDiv.innerHTML = `<p>Error: ${result.error}</p>`;
      return;
    }
    
    // Build aggregated nutrition details
    let html = `<h2>Aggregated Nutrition Data</h2>`;
    html += `<p><strong>Calories:</strong> ${result.totals.nf_calories.toFixed(1)}</p>`;
    html += `<p><strong>Total Fat:</strong> ${result.totals.nf_total_fat.toFixed(1)} g</p>`;
    html += `<p><strong>Carbohydrates:</strong> ${result.totals.nf_total_carbohydrate.toFixed(1)} g</p>`;
    html += `<p><strong>Protein:</strong> ${result.totals.nf_protein.toFixed(1)} g</p>`;
    
    // Build table for individual food items
    html += `<h2>Individual Food Items</h2>`;
    html += `<table>
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
    
    // Display the HTML in the result container
    resultDiv.innerHTML = html;
    
  } catch (error) {
    console.error("Error fetching nutrition data:", error);
    resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
  }
});
