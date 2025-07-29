// src/app.js
const express = require('express'); // Bring in the Express web framework
const comboRoutes = require('./routes/comboRoutes'); // Bring in our combo-related routes
const cors = require('cors'); // This helps your web browser talk to your program

const app = express(); // Create our web application
const PORT = process.env.PORT || 3000; // The "door" number your program will use (3000 is common)

// These are like universal settings for our app
app.use(express.json()); // Allows our app to understand JSON data
app.use(cors()); // Allows other websites (like a future frontend) to access this program

// Tell our app to use the combo routes we defined
app.use('/api/combo', comboRoutes);

// A simple message for when someone visits the main address (like http://localhost:3000/)
app.get('/', (req, res) => {
  res.send('Welcome to the Dynamic Combo Meal Generator API! Use /api/combo/:day to get recommendations (e.g., /api/combo/monday)');
});

// Start the program and listen for requests
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Access combos at /api/combo/:day (e.g., http://localhost:3000/api/combo/monday)');
});