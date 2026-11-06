
// ========================================
// TRAVELMORY — MAIN APPLICATION
// ========================================

// HTML elements
const addMemoryButton = document.getElementById("addMemoryButton");
const memoryDialog = document.getElementById("memoryDialog");
const closeDialog = document.getElementById("closeDialog");
const memoryForm = document.getElementById("memoryForm");

const countriesCount = document.getElementById("countriesCount");
const citiesCount = document.getElementById("citiesCount");
const memoriesCount = document.getElementById("memoriesCount");

const recentGrid = document.getElementById("recentGrid");
const countryList = document.getElementById("countryList");
const favoritesGrid = document.getElementById("favoritesGrid");

const searchInput = document.getElementById("searchInput");
const featuredDestination = document.getElementById("featuredDestination");


// ========================================
// DIALOG — OPEN AND CLOSE
// ========================================

addMemoryButton.addEventListener("click", () => {
    memoryDialog.showModal();
});

closeDialog.addEventListener("click", () => {
    memoryDialog.close();
});


// ========================================
// ADD A NEW MEMORY
// ========================================

memoryForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const newMemory = {
        country: document.getElementById("country").value.trim(),
        city: document.getElementById("city").value.trim(),
        visitDate: document.getElementById("visitDate").value,
        rating: document.getElementById("rating").value,
        notes: document.getElementById("notes").value.trim()
    };

    TravelmoryData.add(newMemory);

    memoryForm.reset();
    memoryDialog.close();

    renderDashboard();
});


// ========================================
// HELPER FUNCTIONS
// ========================================

// Prevent HTML from being interpreted as code
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[character];
    });
}

// Format dates in a readable way
function formatDate(dateString) {
    if (!dateString) return "Date not specified";

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

// Sort memories from newest to oldest
function sortMemories(memories) {
    return [...memories].sort((a, b) =>
        b.visitDate.localeCompare(a.visitDate)
    );
}

// Get the number of unique cities
function getUniqueCities(memories) {
    return new Set(
        memories.map(memory =>
            `${memory.country.toLowerCase()}|${memory.city.toLowerCase()}`
        )
    );
}


// ========================================
// STATISTICS
// ========================================

function renderStatistics(memories) {
    const uniqueCountries = new Set(
        memories.map(memory => memory.country.toLowerCase())
    );

    const uniqueCities = getUniqueCities(memories);

    countriesCount.textContent = uniqueCountries.size;
    citiesCount.textContent = uniqueCities.size;
    memoriesCount.textContent = memories.length;
}


// ========================================
// RECENTLY VISITED
// ========================================

function renderRecentMemories(memories) {
    const recentMemories = sortMemories(memories).slice(0, 6);

    if (recentMemories.length === 0) {
        recentGrid.innerHTML = `
            <div class="empty-state">
                <p>No travel memories yet.</p>
                <p>Start your collection by adding your first memory!</p>
            </div>
        `;
        return;
    }

    recentGrid.innerHTML = recentMemories.map(memory => `
        <article class="destination-card">
            <div class="destination-image"></div>

            <div class="destination-content">
                <h3>${escapeHTML(memory.city)}</h3>
                <p>${escapeHTML(memory.country)}</p>

                <div class="destination-meta">
                    <span>${formatDate(memory.visitDate)}</span>
                    <span>${"★".repeat(memory.rating)}${"☆".repeat(5 - memory.rating)}</span>
                </div>

                ${memory.notes ? `
                    <p class="memory-notes">
                        ${escapeHTML(memory.notes)}
                    </p>
                ` : ""}

                <div class="memory-actions">
                    <button
                        type="button"
                        data-action="favorite"
                        data-id="${escapeHTML(memory.id)}"
                        aria-label="${memory.isFavorite ? "Remove from favorites" : "Add to favorites"}"
                    >
                        ${memory.isFavorite ? "♥ Favorited" : "♡ Add to favorites"}
                    </button>

                    <button
                        type="button"
                        data-action="delete"
                        data-id="${escapeHTML(memory.id)}"
                        aria-label="Delete memory"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </article>
    `).join("");
}


// ========================================
// COUNTRY COLLECTION
// ========================================

function renderCountries(memories) {
    const countries = {};

    memories.forEach(memory => {
        const countryName = memory.country;

        if (!countries[countryName]) {
            countries[countryName] = new Set();
        }

        countries[countryName].add(memory.city);
    });

    const countryNames = Object.keys(countries).sort();

    if (countryNames.length === 0) {
        countryList.innerHTML = `
            <div class="empty-state">
                Your country collection will appear here.
            </div>
        `;
        return;
    }

    countryList.innerHTML = countryNames.map(country => `
        <article class="country-item">
            <h3>${escapeHTML(country)}</h3>
            <p>
                ${countries[country].size}
                ${countries[country].size === 1 ? "city" : "cities"} explored
            </p>
        </article>
    `).join("");
}


// ========================================
// FAVORITE DESTINATIONS
// ========================================

function renderFavorites(memories) {
    const favorites = sortMemories(
        memories.filter(memory => memory.isFavorite)
    );

    if (favorites.length === 0) {
        favoritesGrid.innerHTML = `
            <div class="empty-state">
                Your favorite places will appear here.
                <br>
                Use the heart button on a travel memory to add one.
            </div>
        `;
        return;
    }

    favoritesGrid.innerHTML = favorites.map(memory => `
        <article class="favorite-card">
            <h3>♥ ${escapeHTML(memory.city)}</h3>
            <p>${escapeHTML(memory.country)}</p>
            <p>${formatDate(memory.visitDate)}</p>

            <button
                type="button"
                data-action="favorite"
                data-id="${escapeHTML(memory.id)}"
            >
                Remove from favorites
            </button>
        </article>
    `).join("");
}


// ========================================
// FEATURED DESTINATION
// ========================================

function renderFeaturedDestination(memories) {
    const latestMemory = sortMemories(memories)[0];

    if (!latestMemory) {
        featuredDestination.querySelector(".featured-location").textContent =
            "YOUR NEXT MEMORY";

        featuredDestination.querySelector("h3").textContent =
            "Every place has a story.";

        featuredDestination.querySelector(
            ".featured-content > p:last-child"
        ).textContent =
            "Add your first travel memory and let your collection grow.";

        return;
    }

    featuredDestination.querySelector(".featured-location").textContent =
        latestMemory.country.toUpperCase();

    featuredDestination.querySelector("h3").textContent =
        latestMemory.city;

    featuredDestination.querySelector(
        ".featured-content > p:last-child"
    ).textContent =
        latestMemory.notes || `Your visit on ${formatDate(latestMemory.visitDate)}.`;
}


// ========================================
// SEARCH
// ========================================

function renderSearchResults() {
    const allMemories = TravelmoryData.getAll();
    const searchTerm = searchInput.value.trim().toLowerCase();

    const filteredMemories = allMemories.filter(memory =>
        memory.city.toLowerCase().includes(searchTerm) ||
        memory.country.toLowerCase().includes(searchTerm) ||
        memory.notes.toLowerCase().includes(searchTerm)
    );

    renderRecentMemories(filteredMemories);
}


// ========================================
// FAVORITE AND DELETE ACTIONS
// ========================================

document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");

    if (!button) return;

    const memoryId = button.dataset.id;
    const action = button.dataset.action;

    if (action === "favorite") {
        const memory = TravelmoryData.getAll().find(
            item => item.id === memoryId
        );

        if (!memory) return;

        TravelmoryData.update(memoryId, {
            isFavorite: !memory.isFavorite
        });

        renderDashboard();
    }

    if (action === "delete") {
        const confirmed = window.confirm(
            "Are you sure you want to delete this memory?"
        );

        if (!confirmed) return;

        TravelmoryData.remove(memoryId);
        renderDashboard();
    }
});


// ========================================
// DASHBOARD
// ========================================

function renderDashboard() {
    const memories = TravelmoryData.getAll();

    renderStatistics(memories);
    renderFeaturedDestination(memories);
    renderSearchResults();
    renderCountries(memories);
    renderFavorites(memories);
}


// Search updates the recent memories as you type
searchInput.addEventListener("input", renderSearchResults);


// Initial dashboard render
renderDashboard();
