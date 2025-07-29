// script.js

// Get references to our HTML elements
const daySelect = document.getElementById('daySelect');
const generate3DayBtn = document.getElementById('generate3DayBtn'); // Renamed ID
const generateWeekBtn = document.getElementById('generateWeekBtn'); // NEW ID
const comboOutput = document.getElementById('comboOutput');

// Define the order of days in a week
const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

// Function to get the next N consecutive days, wrapping around Sunday to Monday
function getConsecutiveDays(startDay, numberOfDays) {
    const startIndex = daysOfWeek.indexOf(startDay.toLowerCase());
    if (startIndex === -1) {
        return []; // Invalid start day
    }

    const consecutiveDays = [];
    for (let i = 0; i < numberOfDays; i++) {
        consecutiveDays.push(daysOfWeek[(startIndex + i) % daysOfWeek.length]);
    }
    return consecutiveDays;
}

// Function to display a loading spinner in the output area
function showLoader() {
    comboOutput.innerHTML = '<div class="loader"></div>';
}

// Function to show an error message in the output area
function showErrorMessage(message) {
    comboOutput.innerHTML = `<p class="placeholder-text error-message">${message}</p>`;
}

// Function to generate the HTML for a set of combo cards for a given day
function generateComboCardsHtml(day, combos) {
    if (!combos || combos.length === 0) {
        return `<p class="placeholder-text">No suitable combos found for ${day}.</p>`;
    }

    let comboCardsHtml = '';
    combos.forEach(combo => {
        const formattedPopularity = typeof combo.popularity_score === 'number'
            ? combo.popularity_score.toFixed(2)
            : combo.popularity_score;

        comboCardsHtml += `
            <div class="combo-card">
                <h3>Combo #${combo.combo_id}</h3>
                <p><strong>Main:</strong> ${combo.main}</p>
                <p><strong>Side:</strong> ${combo.side}</p>
                <p><strong>Drink:</strong> ${combo.drink}</p>
                <p><strong>Calories:</strong> ${combo.total_calories}</p>
                <p><strong>Taste:</strong> ${combo.taste_profile}</p>
                <p><strong>Popularity:</strong> ${formattedPopularity}</p>
                <p class="remarks">${combo.remarks}</p>
            </div>
        `;
    });
    return comboCardsHtml;
}

// Unified function to fetch and display combos for a given number of days
async function fetchAndDisplayCombos(numberOfDays) {
    const selectedStartDay = daySelect.value;
    const daysToFetch = getConsecutiveDays(selectedStartDay, numberOfDays);

    showLoader(); // Display the loading spinner

    let allDaysForecastHtml = '';
    let hasOverallError = false;

    for (const day of daysToFetch) {
        const apiUrl = `http://localhost:3000/api/combo/${day}`;

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const combos = await response.json();

            allDaysForecastHtml += `
                <div class="day-section">
                    <h2>Combos for ${day.charAt(0).toUpperCase() + day.slice(1)}</h2>
                    <div class="combos-grid">
                        ${generateComboCardsHtml(day, combos)}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error(`Error fetching combos for ${day}:`, error);
            hasOverallError = true;

            allDaysForecastHtml += `
                <div class="day-section">
                    <h2>Combos for ${day.charAt(0).toUpperCase() + day.slice(1)}</h2>
                    <p class="placeholder-text error-message">Failed to load combos for ${day}: ${error.message}.</p>
                </div>
            `;
        }
    }

    if (hasOverallError) {
        comboOutput.innerHTML = allDaysForecastHtml +
            `<p class="placeholder-text error-message" style="margin-top: 20px;">
                Some recommendations might be missing or have issues. Please ensure your Node.js server is running correctly.
            </p>`;
    } else {
        comboOutput.innerHTML = allDaysForecastHtml;
    }
}

// Event listener for the "Generate 3-Day Forecast" button
generate3DayBtn.addEventListener('click', () => fetchAndDisplayCombos(3));

// Event listener for the NEW "Show Full Week Plan" button
generateWeekBtn.addEventListener('click', () => fetchAndDisplayCombos(7));

// Optional: You can uncomment the following block if you want it to load combos
// for the current day automatically when the page first loads.
/*
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
    daySelect.value = today; // Set the dropdown to today's day
    generate3DayBtn.click(); // Simulate a click to load initial 3-day forecast
});
*/