# Dynamic Combo Meal Generator

This project is a web-based application designed to dynamically generate daily combo meal recommendations for a restaurant. Built with a Node.js/Express.js backend and a pure HTML, CSS, and JavaScript frontend, it provides flexible meal planning solutions with intelligent constraints.

---

## Table of Contents

-   [Features](#features)
-   [Technologies Used](#technologies-used)
-   [Project Structure](#project-structure)
-   [How to Run Locally](#how-to-run-locally)
    -   [Prerequisites](#prerequisites)
    -   [Setup Steps](#setup-steps)
-   [API Endpoints](#api-endpoints)
-   [Constraints & Uniqueness Considerations](#constraints--uniqueness-considerations)
-   [Future Enhancements](#future-enhancements)
-   [License](#license)
-   [Contact](#contact)

---

## Features

* **Dynamic Combo Generation:** Generates 3 unique combo meal recommendations for a selected day.
* **Customizable Forecast:** Users can choose a starting day to view a **3-day forecast** or a **full 7-day week plan**.
* **Strict Uniqueness Rules:**
    * **No Dish Repetition:** Ensures that no single dish is repeated within the 3 combos generated for any given day.
    * **Combo Uniqueness Across Days:** Prevents the same combination of Main, Side, and Drink from being repeated across recently generated daily plans. This is handled using an in-memory store that tracks combos for a rolling 3-day window to maintain efficiency without a database.
* **Calorie-Controlled Combos:** Each generated combo adheres to a specified calorie range (550-800 calories).
* **Taste Preference Integration:** Combos are prioritized based on a preferred taste profile for each day (e.g., spicy, savory, sweet), with a robust fallback mechanism to ensure 3 combos are always generated even if strict taste preferences cannot be met.
* **Modular Architecture:** Clear separation of concerns between frontend (presentation) and backend (business logic, API).
* **User-Friendly Interface:** A simple, intuitive interface allows users to select a starting day and view generated meal plans with clear "boxed" combo displays.

## Technologies Used

* **Backend:** Node.js, Express.js (for RESTful API)
* **Frontend:** HTML5, CSS3, JavaScript (for interactive UI and API calls)
* **Data Storage:** In-memory JavaScript arrays/objects (for menu items and temporary combo tracking). No persistent database is used, meaning combos regenerate randomly on server restart.

## Project Structure

combo-meal-generator/
├── src/
│   ├── app.js               # Main Express application setup
│   ├── data/
│   │   └── menuItems.js     # Menu data (replace with your actual data from CSV)
│   ├── routes/
│   │   └── comboRoutes.js   # API endpoint definition for combos
│   └── utils/
│       ├── comboGenerator.js # Core logic for generating combos
│       └── randomization.js # Utility for random selections
│       └── comboValidation.js # Utility for combo validation rules
├── index.html               # Frontend HTML structure
├── style.css                # Frontend CSS styling
├── script.js                # Frontend JavaScript logic for UI interaction & API calls
├── package.json             # Project metadata and dependencies
├── .gitignore               # Specifies files/folders to ignore in Git (e.g., node_modules)
└── README.md                # This file!


## How to Run Locally

### Prerequisites

* Node.js (LTS version recommended)
* npm (comes with Node.js)
* Git

### Setup Steps

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/KrittikaDas/combo-meal-generator.git](https://github.com/KrittikaDas/combo-meal-generator.git)
    cd combo-meal-generator
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Prepare Menu Data:**
    * The project expects menu data to be present in `src/data/menuItems.js`.
    * **Crucial Step:** Manually populate `src/data/menuItems.js` with your specific menu data, ensuring items are structured as JavaScript objects with `item_name`, `category`, `calories`, `taste_profile`, and `popularity_score` properties (e.g., derived from your `AI Menu Recommender Items.csv`). Ensure `calories` and `popularity_score` are parsed as numbers.

4.  **Start the Backend Server:**
    ```bash
    npm start
    ```
    The server will typically run on `http://localhost:3000`. Keep this terminal window open.

5.  **Open the Frontend:**
    Open the `index.html` file directly in your web browser. You can usually do this by navigating to the file path (e.g., `file:///C:/Users/Asus/Documents/combo-meal-generator/index.html`) or by right-clicking `index.html` and choosing "Open with Browser".

## API Endpoints

The backend exposes a single RESTful API endpoint:

* **`GET /api/combo/:day`**
    * **Description:** Generates and returns an array of 3 unique combo meals for the specified day.
    * **Parameters:**
        * `:day` (string): The day of the week (e.g., `monday`, `tuesday`, `wednesday`, etc.).
    * **Example Response (JSON):**
        ```json
        [
          {
            "combo_id": 1,
            "main": "Chicken Biryani",
            "side": "Garlic Naan",
            "drink": "Masala Chaas",
            "total_calories": 750,
            "taste_profile": ["spicy"],
            "popularity_score": 2.65,
            "remarks": "Spicy combo for Monday. Calories: 750."
          },
          // ... two more combo objects
        ]
        ```

## Constraints & Uniqueness Considerations

* **No Database:** As per the assignment constraints, this project does not use a persistent database. All data (menu items) are loaded from a JavaScript file (`menuItems.js`), and generated combo uniqueness across days is maintained in memory for a limited rolling window. This means that if the server restarts, the "history" of generated combos is reset.
* **Randomization on Refresh:** Every time the server is restarted or a new request is made, the combo generation process starts afresh, selecting a new random subset of dishes, ensuring variety.

## Future Enhancements

* Implement a persistent database (e.g., MongoDB, PostgreSQL) for storing menu items and combo history for long-term uniqueness and analytics.
* Add a UI for managing menu items (CRUD operations).
* Integrate more complex recommendation algorithms (e.g., based on user feedback or actual sales data).
* Improve error handling and user feedback in the UI.
* Add unit and integration tests for backend logic.

## License

This project is open-sourced under the MIT License.
## How to Run Locally

## Contact

For any questions or feedback, feel free to reach out:

* **Krittika Das**
