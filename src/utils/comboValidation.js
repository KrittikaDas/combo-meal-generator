// src/utils/comboValidation.js
function isValidCombo(combo) {
  // Checks if the total calories are between 550 and 800
  const totalCalories = combo.main.calories + combo.side.calories + combo.drink.calories;
  return totalCalories >= 550 && totalCalories <= 800;
}

function getComboTasteProfile(combo) {
  // Determines the overall taste profile of the combo
  const tastes = [combo.main.taste_profile, combo.side.taste_profile, combo.drink.taste_profile];
  const uniqueTastes = [...new Set(tastes)]; // Get unique tastes

  if (uniqueTastes.length === 1) {
    return uniqueTastes[0]; // If all are the same taste (e.g., all spicy)
  } else if (uniqueTastes.includes('spicy') && uniqueTastes.includes('savory')) {
    return 'spicy-savory';
  } else if (uniqueTastes.includes('sweet') && uniqueTastes.includes('savory')) {
    return 'sweet-savory';
  } else if (uniqueTastes.includes('sweet') && uniqueTastes.includes('spicy')) {
    return 'sweet-spicy';
  }
  return uniqueTastes.join('-'); // Fallback for more complex mixes
}

function getComboPopularity(combo) {
  // Calculates the sum of popularity scores for the combo
  return combo.main.popularity_score + combo.side.popularity_score + combo.drink.popularity_score;
}

module.exports = {
  isValidCombo,
  getComboTasteProfile,
  getComboPopularity,
};