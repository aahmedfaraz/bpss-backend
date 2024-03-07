const express = require('express');
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./db');

// Connect to MongoDB
connectDB();

// Initialize the app
const app = express();

// Init Middleware
app.use(express.json({ extended: false}));

// Enable CORS for all origins
app.use(cors());

// GET route to retrieve data
app.get('/', (req, res) => {
  res.json({
    statusCode: 200,
    message: 'Welcome to the BPSS Backend.'
  });
});

// Define Routes here
app.use('/admin', require('./routes/admin'));
app.use('/attendance', require('./routes/attendance'));
app.use('/guard', require('./routes/guard'));
app.use('/location', require('./routes/location'));
app.use('/organization', require('./routes/organization'));
app.use('/supervisor', require('./routes/supervisor'));

const port = process.env.PORT || 5000; // Use environment variable for port or default to 5000

app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});
