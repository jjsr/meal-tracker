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

    // Return the API response
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

