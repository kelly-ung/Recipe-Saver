// Sets up an Express server that handles requests to the Edamam API
const express = require('express'); 
const cors = require('cors'); // permit cross-origin requests
const app = express();

app.use(cors()); 

require('dotenv').config(); // load environment variables from .env file
const app_id = process.env.REACT_APP_API_ID;
const app_key = process.env.REACT_APP_API_KEY;

// Endpoint to handle search requests
app.get("/", async (req, res) => {
    const query = req.query.search // get the search query from the request
    const url = `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${app_id}&app_key=${app_key}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        res.json(data.hits);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

// Set the port to listien on
const port = process.env.PORT || 5001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});