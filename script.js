// API URL for fetching meal data
const API_URL = 'https://www.themealdb.com/api/json/v1/1/';

// Function to search for meals based on user input
function searchMeal() {
    const searchInput = document.getElementById('searchInput').value;

    if (searchInput.trim() !== '') {
        fetch(`${API_URL}search.php?s=${searchInput}`)
            .then(response => response.json())
            .then(data => displaySearchResults(data.meals));
    } else {
        clearSearchResults();
    }
}

// Function to display search results
function displaySearchResults(meals) {
    const searchResultsContainer = document.getElementById('searchResults');
    searchResultsContainer.innerHTML = '';

    meals.forEach(meal => {
        const card = createMealCard(meal);
        searchResultsContainer.appendChild(card);
    });
}

// Function to clear search results
function clearSearchResults() {
    document.getElementById('searchResults').innerHTML = '';
}

// Function to create a card for a meal
function createMealCard(meal) {
    const card = document.createElement('div');
    card.classList.add('card', 'mb-3', 'col-md-3');

    const image = meal.strMealThumb ? `<img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">` : '';
    const cardBody = `
        <div class="card-body">
            <h5 class="card-title">${meal.strMeal}</h5>
            <p class="card-text">${meal.strInstructions.slice(0, 100)}...</p>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="addToFavourites('${meal.idMeal}')">Add to Favourites</button>
                <button class="btn btn-secondary" onclick="showMealDetails('${meal.idMeal}')">View Details</button>
            </div>
        </div>
    `;

    card.innerHTML = image + cardBody;
    return card;
}

// Function to fetch and display meal details in a modal
function showMealDetails(mealId) {
    fetch(`${API_URL}lookup.php?i=${mealId}`)
        .then(response => response.json())
        .then(data => {
            const mealDetails = data.meals[0];
            displayMealDetailsModal(mealDetails);
        });
}

// Function to display meal details in a modal
function displayMealDetailsModal(mealDetails) {
    const modalTitle = document.getElementById('mealDetailsModalLabel');
    const modalContent = document.getElementById('mealDetailsContent');

    modalTitle.textContent = mealDetails.strMeal;
    modalContent.innerHTML = `
        <img src="${mealDetails.strMealThumb}" class="img-fluid mb-3" alt="${mealDetails.strMeal}">
        <p>${mealDetails.strInstructions}</p>
    `;

    $('#mealDetailsModal').modal('show');
}

// Load the favorites from localStorage when the page loads
let favouritesList = JSON.parse(localStorage.getItem('favouritesList')) || [];

// Function to toggle between displaying all meals and favourite meals
function toggleFavourites() {
    const favouritesSection = document.getElementById('favouritesSection');
    const searchResultsContainer = document.getElementById('searchResults');
    const favouritesCountIndicator = document.getElementById('favouritesCountIndicator');

    if (favouritesSection.style.display === 'none') {
        // Show favourites section and hide search results
        favouritesSection.style.display = 'block';
        searchResultsContainer.style.display = 'none';
        favouritesCountIndicator.style.display = 'inline'; // Show the favourites count
        showFavourites(); // Display the favourite meals
    } else {
        // Show search results and hide favourites section
        favouritesSection.style.display = 'none';
        searchResultsContainer.style.display = 'flex'; // Show the search results in a row
        favouritesCountIndicator.style.display = 'none'; // Hide the favourites count
    }
}

// Function to go back to the search results
function goBackToMeal() {
    toggleFavourites();
}

// Function to add a meal to the favourites list
function addToFavourites(mealId) {
    if (!favouritesList.includes(mealId)) {
        favouritesList.push(mealId);
        updateFavouritesCount();
        showFavourites();
        saveFavouritesToLocalStorage(); // Save the updated list to localStorage
        showToast('added');
    }
}

// Function to remove a meal from the favourites list
function removeFromFavourites(mealId) {
    const index = favouritesList.indexOf(mealId);
    if (index !== -1) {
        favouritesList.splice(index, 1);
        updateFavouritesCount();
        showFavourites();
        saveFavouritesToLocalStorage(); // Save the updated list to localStorage
        showToast('removed');
    }
}

// Function to save the favourites list to localStorage
function saveFavouritesToLocalStorage() {
    localStorage.setItem('favouritesList', JSON.stringify(favouritesList));
}

// Function to update the favourites count in the UI
function updateFavouritesCount() {
    const favouritesCount = document.getElementById('favouritesCount');
    const favouritesCountIndicator = document.getElementById('favouritesCountIndicator');
    favouritesCount.textContent = favouritesList.length;
    favouritesCountIndicator.textContent = `(${favouritesList.length})`;
}

// Function to display the favourite meals in the favourites section
function showFavourites() {
    const favouritesResultsContainer = document.getElementById('favouritesResults');
    favouritesResultsContainer.innerHTML = '';

    favouritesList.forEach(mealId => {
        // Fetch the meal details using the mealId and create the card
        fetch(`${API_URL}lookup.php?i=${mealId}`)
            .then(response => response.json())
            .then(data => {
                const mealDetails = data.meals[0];

                // Create a card for the favourite meal
                const card = document.createElement('div');
                card.classList.add('card', 'mb-3', 'col-md-3');

                const image = mealDetails.strMealThumb ? `<img src="${mealDetails.strMealThumb}" class="card-img-top" alt="${mealDetails.strMeal}">` : '';
                const cardBody = `
                    <div class="card-body">
                        <h5 class="card-title">${mealDetails.strMeal}</h5>
                        <p class="card-text">${mealDetails.strInstructions.slice(0, 100)}...</p>
                        <div class="btn-group">
                            <button class="btn btn-primary" onclick="showMealDetails('${mealDetails.idMeal}')">View Details</button>
                            <button class="btn btn-danger" onclick="removeFromFavourites('${mealDetails.idMeal}')">Remove from Favourites</button>
                        </div>
                    </div>
                `;

                card.innerHTML = image + cardBody;
                favouritesResultsContainer.appendChild(card);
            });
    });
}

// Initialize the favourites count at the beginning
updateFavouritesCount();

// Function to show a toast message
function showToast(action) {
    let message;

    if (action === 'added') {
        message = 'Meal added to Favorites';
    } else if (action === 'removed') {
        message = 'Meal removed from Favorites';
    }

    // Use a simple JavaScript alert for displaying the message
    alert(message);
}
