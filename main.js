document.getElementById('mealForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const date = document.getElementById('mealDate').value;
  const mealDescription = document.getElementById('mealDesc').value;

  try {
    // Call your Netlify serverless function. 
    // Netlify will serve functions at "/.netlify/functions/<functionName>"
    const response = await fetch('/.netlify/functions/nutritionix', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: mealDescription })
    });
    
    if (!response.ok) {
      throw new Error("Server error");
    }
    
    const data = await response.json();
    
    // Assume the first food item returned contains the nutritional info.
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

    // Update the page with the fetched nutrition details.
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
    
  } catch (error) {
    console.error(error);
    document.getElementById('result').innerText = "An error occurred. Please try again.";
  }
});
