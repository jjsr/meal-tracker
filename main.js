document.getElementById('mealForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const date = document.getElementById('mealDate').value;
  const mealDescription = document.getElementById('mealDesc').value;

  // Nutritionix API endpoint and credentials
  const url = 'https://trackapi.nutritionix.com/v2/natural/nutrients';
  const appId = 'YOUR_APP_ID';      // Replace with your Nutritionix APP_ID
  const appKey = 'YOUR_APP_KEY';    // Replace with your Nutritionix APP_KEY

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        "x-app-id": appId,
        "x-app-key": appKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query: mealDescription })
    });
    
    if (!response.ok) {
      throw new Error("API call failed");
    }
    
    const data = await response.json();
    
    // Use the first food item from the API response
    const foodItem = data.foods[0];
    const resultData = {
      date,
      meal: mealDescription,
      kcal: foodItem.nf_calories,
      protein: foodItem.nf_protein,
      fat: foodItem.nf_total_fat,
      carbs: foodItem.nf_total_carbohydrate,
      fiber: foodItem.nf_dietary_fiber
    };

    // Display the fetched nutrition details on the page
    document.getElementById('result').innerHTML = `
      <h2>Nutrition Details</h2>
      <p><strong>Date:</strong> ${resultData.date}</p>
      <p><strong>Meal:</strong> ${resultData.meal}</p>
      <p><strong>Kcal:</strong> ${resultData.kcal}</p>
      <p><strong>Protein:</strong> ${resultData.protein}g</p>
      <p><strong>Fat:</strong> ${resultData.fat}g</p>
      <p><strong>Carbs:</strong> ${resultData.carbs}g</p>
      <p><strong>Fiber:</strong> ${resultData.fiber}g</p>
    `;

    // Update Google Sheet with the fetched data
    updateGoogleSheet(resultData);
    
  } catch (error) {
    console.error(error);
    document.getElementById('result').innerText = "An error occurred. Please try again.";
  }
});

async function updateGoogleSheet(data) {
  // Replace with your deployed Google Apps Script Web App URL
  const scriptUrl = 'YOUR_APPS_SCRIPT_WEB_APP_URL';

  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (result.status === 'success') {
      console.log("Google Sheet updated successfully");
    } else {
      console.error("Error updating sheet:", result.message);
    }
  } catch (error) {
    console.error("Error posting to Google Sheets:", error);
  }
}
