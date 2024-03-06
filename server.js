const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for all origins (for development purposes only)
app.use(cors());

// Example data for GET request
const data = {
  message: "Hello from the server!",
  data: [1, 2, 3, 4, 5],
};

// GET route to retrieve data
app.get('/data', (req, res) => {
  res.json(data);
});

const port = process.env.PORT || 8080; // Use environment variable for port or default to 3000

app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});
