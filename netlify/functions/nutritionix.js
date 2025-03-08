const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  try {
    // Parse the POST body
    const body = JSON.parse(event.body);
    const query = body.query;

    // Get your API credentials from environment variables
    const appId = process.env.APP_ID;
    const appKey = process.env.APP_KEY;

    // Call the Nutritionix API
    const response = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
      method: 'POST',
      headers: {
        "x-app-id": appId,
        "x-app-key": appKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Failed to fetch nutrition data" })
      };
    }

    const data = await response.json();

    // Process the response if a foods array is returned
    if (Array.isArray(data.foods)) {
      // Initialize aggregated totals for key nutrients
      let totals = {
        nf_calories: 0,
        nf_total_fat: 0,
        nf_total_carbohydrate: 0,
        nf_protein: 0
        // Add more nutrient fields if needed
      };

      // Sum up the nutrient values from each food item
      data.foods.forEach(food => {
        totals.nf_calories += food.nf_calories || 0;
        totals.nf_total_fat += food.nf_total_fat || 0;
        totals.nf_total_carbohydrate += food.nf_total_carbohydrate || 0;
        totals.nf_protein += food.nf_protein || 0;
      });

      // Return both aggregated totals and individual food items
      const result = {
        totals,
        individual: data.foods
      };

      return {
        statusCode: 200,
        body: JSON.stringify(result)
      };
    }

    // Fallback: Return data as is if no foods array is present
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
