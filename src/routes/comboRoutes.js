// src/routes/comboRoutes.js
const express = require('express');
const router = express.Router();
const menuItems = require('../data/menuItems'); // Get our menu data
const { generateCombos } = require('../utils/comboGenerator'); // Get our combo generation logic

// This defines what happens when someone visits http://localhost:3000/api/combo/monday
router.get('/:day', (req, res) => {
  const day = req.params.day; // Get the day (e.g., 'monday') from the web address

  if (!day) {
    return res.status(400).json({ error: 'Day of the week is required.' });
  }

  try {
    const combos = generateCombos(menuItems, day); // Generate the combos for that day
    if (combos.length === 0) {
      // If no combos could be generated, send a message
      return res.status(404).json({ message: `No suitable combos could be generated for ${day}. Try another day or refresh.` });
    }
    res.json(combos); // Send the generated combos back as JSON
  } catch (error) {
    console.error(`Error generating combos for ${day}:`, error);
    res.status(500).json({ error: 'Internal server error during combo generation.' });
  }
});

module.exports = router;