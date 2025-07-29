// src/utils/comboGenerator.js
const { getRandomElements } = require('./randomization');
const { isValidCombo, getComboTasteProfile, getComboPopularity } = require('./comboValidation');

// This stores combos generated for previous days.
// IMPORTANT: This data is in-memory and will clear if the Node.js server restarts.
// For a hackathon, this is typically acceptable given the "no database" constraint.
const previousDaysCombos = {}; // Stores something like { 'monday': [combo1, combo2, combo3] }

// Define preferred taste profiles for each day
const getPreferenceForDay = (day) => {
  const lowerCaseDay = day.toLowerCase();
  switch (lowerCaseDay) {
    case 'monday':
      return 'spicy';
    case 'tuesday':
      return 'savory';
    case 'wednesday':
      return 'sweet';
    case 'thursday':
      return 'spicy';
    case 'friday':
      return 'savory';
    case 'saturday':
      return 'sweet';
    case 'sunday':
      return 'spicy';
    default:
      return 'savory'; // Default if an unknown day is requested
  }
};

function generateCombos(menuItems, day) {
  const mains = menuItems.filter(item => item.category === 'main');
  const sides = menuItems.filter(item => item.category === 'side');
  const drinks = menuItems.filter(item => item.category === 'drink');

  // Select a larger pool of random items to increase chances of finding valid combos
  const selectedMains = getRandomElements(mains, Math.min(mains.length, 8)); // Up to 8 mains
  const selectedSides = getRandomElements(sides, Math.min(sides.length, 6)); // Up to 6 sides
  const selectedDrinks = getRandomElements(drinks, Math.min(drinks.length, 6)); // Up to 6 drinks

  const generatedCombos = [];
  // Use a Set to ensure no dish is repeated within the *current day's* generated combos
  const usedDishesToday = new Set();
  const targetTaste = getPreferenceForDay(day);

  // Helper to check if a dish has already been used in a combo for the current day
  const isDishUsedToday = (dish) => usedDishesToday.has(dish.item_name);

  // Helper to check if a potential combo is unique across previously generated combos for this day
  // AND unique against combos from the last 2 days (stored in previousDaysCombos)
  const isComboUniqueAcrossDays = (potentialCombo) => {
    // Create a unique signature for the combo for easy comparison
    const currentComboSignature = [potentialCombo.main.item_name, potentialCombo.side.item_name, potentialCombo.drink.item_name].sort().join('-');

    // 1. Check uniqueness within the combos already generated for *this specific day*
    const currentDayCombosSignatures = generatedCombos.map(c => [c.main, c.side, c.drink].sort().join('-'));
    if (currentDayCombosSignatures.includes(currentComboSignature)) {
      return false; // Not unique within today's combos already found
    }

    // 2. Check uniqueness against combos from the *last 2 days*
    // This uses the 'previousDaysCombos' global state, which persists across different '/api/combo/:day' calls
    const daysToCheck = Object.keys(previousDaysCombos).slice(-2); // Get the names of the last 2 days in memory
    for (const prevDay of daysToCheck) {
      const prevCombos = previousDaysCombos[prevDay] || [];
      for (const prevCombo of prevCombos) {
        const prevComboSignature = [prevCombo.main, prevCombo.side, prevCombo.drink].sort().join('-');
        if (prevComboSignature === currentComboSignature) {
          return false; // Combo repeated across days
        }
      }
    }
    return true; // If we reach here, the combo is unique!
  };

  // --- Phase 1: Attempt to generate combos with preferred taste first ---
  let attemptsWithPreference = 0;
  const maxAttemptsPreference = 500; // Max attempts to find preferred taste combos

  while (generatedCombos.length < 3 && attemptsWithPreference < maxAttemptsPreference) {
    const main = getRandomElements(selectedMains, 1)[0];
    const side = getRandomElements(selectedSides, 1)[0];
    const drink = getRandomElements(selectedDrinks, 1)[0];

    // Skip if any component is missing or already used today
    if (!main || !side || !drink || isDishUsedToday(main) || isDishUsedToday(side) || isDishUsedToday(drink)) {
      attemptsWithPreference++;
      continue;
    }

    const potentialCombo = { main, side, drink };
    const comboTaste = getComboTasteProfile(potentialCombo);

    // Check calorie rules AND preferred taste AND uniqueness
    if (isValidCombo(potentialCombo) && comboTaste.includes(targetTaste)) {
      if (isComboUniqueAcrossDays(potentialCombo)) {
        const totalCalories = potentialCombo.main.calories + potentialCombo.side.calories + potentialCombo.drink.calories;
        const popularityScore = getComboPopularity(potentialCombo);

        generatedCombos.push({
          combo_id: generatedCombos.length + 1,
          main: potentialCombo.main.item_name,
          side: potentialCombo.side.item_name,
          drink: potentialCombo.drink.item_name,
          total_calories: totalCalories,
          taste_profile: comboTaste,
          popularity_score: parseFloat(popularityScore.toFixed(2)),
          remarks: `${comboTaste} combo for ${day}. Calories: ${totalCalories}.`,
        });

        // Mark dishes as used for today's combos
        usedDishesToday.add(main.item_name);
        usedDishesToday.add(side.item_name);
        usedDishesToday.add(drink.item_name);
      }
    }
    attemptsWithPreference++;
  }

  // --- Phase 2: Fallback - If less than 3 combos, try to generate remaining without strict taste preference ---
  let attemptsWithoutPreference = 0;
  const maxAttemptsNoPreference = 500; // Max attempts for general valid combos

  if (generatedCombos.length < 3) {
      console.warn(`Could not generate 3 combos for ${day} with preferred taste. Trying without strict taste preference.`);
  }

  while (generatedCombos.length < 3 && attemptsWithoutPreference < maxAttemptsNoPreference) {
    const main = getRandomElements(selectedMains, 1)[0];
    const side = getRandomElements(selectedSides, 1)[0];
    const drink = getRandomElements(selectedDrinks, 1)[0];

    // Skip if any component is missing or already used today
    if (!main || !side || !drink || isDishUsedToday(main) || isDishUsedToday(side) || isDishUsedToday(drink)) {
      attemptsWithoutPreference++;
      continue;
    }

    const potentialCombo = { main, side, drink };
    const comboTaste = getComboTasteProfile(potentialCombo);

    // Only check calorie and uniqueness (dish-wise & cross-day combo-wise)
    if (isValidCombo(potentialCombo)) {
      if (isComboUniqueAcrossDays(potentialCombo)) {
        const totalCalories = potentialCombo.main.calories + potentialCombo.side.calories + potentialCombo.drink.calories;
        const popularityScore = getComboPopularity(potentialCombo);

        generatedCombos.push({
          combo_id: generatedCombos.length + 1,
          main: potentialCombo.main.item_name,
          side: potentialCombo.side.item_name,
          drink: potentialCombo.drink.item_name,
          total_calories: totalCalories,
          taste_profile: comboTaste, // Still show the actual taste profile
          popularity_score: parseFloat(popularityScore.toFixed(2)),
          remarks: `(Fallback) ${comboTaste} combo for ${day}. Calories: ${totalCalories}.`, // Add a note for fallback combos
        });

        // Mark dishes as used for today's combos
        usedDishesToday.add(main.item_name);
        usedDishesToday.add(side.item_name);
        usedDishesToday.add(drink.item_name);
      }
    }
    attemptsWithoutPreference++;
  }

  // Final check: If still less than 3, log an error (should be rare with increased attempts/fallback)
  if (generatedCombos.length < 3) {
      console.error(`ERROR: Still could not generate 3 combos for ${day} after all attempts. Generated: ${generatedCombos.length}`);
  }

  // Store generated combos for the current day for future uniqueness checks (across days)
  previousDaysCombos[day] = generatedCombos;

  // Cleanup old days from 'previousDaysCombos' to prevent excessive memory usage and ensure "recent" uniqueness applies
  const days = Object.keys(previousDaysCombos).sort(); // Sort keys to easily remove the oldest
  if (days.length > 3) { // Keep only the last 3 days' combos in memory
    delete previousDaysCombos[days[0]]; // Remove the oldest day
  }

  return generatedCombos;
}

module.exports = {
  generateCombos,
};