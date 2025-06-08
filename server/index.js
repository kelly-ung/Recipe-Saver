const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); 

require('dotenv').config(); // Load environment variables from .env file
const app_id = process.env.REACT_APP_API_ID;
const app_key = process.env.REACT_APP_API_KEY;

app.get("/", async (req, res) => {
    const query = req.query.search
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

const port = process.env.PORT || 5001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});