
// ===================================
// TRAVELMORY — MAIN APPLICATION
// ===================================

// HTML elements
const addButton = document.getElementById("addMemoryButton");
const dialog = document.getElementById("memoryDialog");
const closeButton = document.getElementById("closeDialog");
const memoryForm = document.getElementById("memoryForm");

const countriesCount = document.getElementById("countriesCount");
const citiesCount = document.getElementById("citiesCount");
const memoriesCount = document.getElementById("memoriesCount");

const recentGrid = document.getElementById("recentGrid");
const countryList = document.getElementById("countryList");


// ===================================
// OPEN AND CLOSE FORM
// ===================================

addButton.addEventListener("click", () => {
    dialog.showModal();
});

closeButton.addEventListener("click", () => {
    dialog.close();
});

dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
        dialog.close();
    }
});


// ===================================
// ADD NEW MEMORY
// ===================================

memoryForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const newMemory = {
        country: document.getElementById("countryInput").value.trim(),
        city: document.getElementById("cityInput").value.trim(),
        date: document.getElementById("dateInput").value,
        rating: Number(document.getElementById("ratingInput").value),
        notes: document.getElementById("memoryInput").value.trim()
    };

    TravelmoryData.add(newMemory);

    memoryForm.reset();
    dialog.close();

    renderDashboard();

});


// ===================================
// HELPER FUNCTIONS
// ===================================

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, (character) => {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];

    });

}


function formatDate(dateString) {

    if (!dateString) return "";

    return new Date(dateString + "T12:00:00").toLocaleDateString(
        "en-GB",
        {
            month: "long",
            year: "numeric"
        }
    );

}


// ===================================
// UPDATE STATISTICS
// ===================================

function renderStatistics(memories) {

    const countries = new Set(
        memories.map(memory => memory.country.toLowerCase())
    );

    const cities = new Set(
        memories.map(memory =>
            `${memory.country.toLowerCase()}-${memory.city.toLowerCase()}`
        )
    );

    countriesCount.textContent = countries.size;
    citiesCount.textContent = cities.size;
    memoriesCount.textContent = memories.length;

}


// ===================================
// RECENTLY VISITED
// ===================================

function renderRecentMemories(memories) {

    const sortedMemories = [...memories].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );

    recentGrid.innerHTML = "";

    if (sortedMemories.length === 0) {

        recentGrid.innerHTML = `
            <p class="empty-state">
                Your travel story starts here. Add your first memory!
            </p>
        `;

        return;
    }

    sortedMemories.slice(0, 4).forEach(memory => {

        const card = document.createElement("article");
        card.className = "destination-card";

        card.innerHTML = `
            <div class="destination-image memory-placeholder">
                <span>✈</span>
            </div>

            <div class="destination-info">

                <p>${escapeHTML(memory.country)}</p>

                <h3>${escapeHTML(memory.city)}</h3>

                <span>${formatDate(memory.date)}</span>

                <div class="memory-rating">
                    ${"★".repeat(memory.rating)}${"☆".repeat(5 - memory.rating)}
                </div>

                ${
                    memory.notes
                        ? `<p class="memory-notes">${escapeHTML(memory.notes)}</p>`
                        : ""
                }

            </div>
        `;

        recentGrid.appendChild(card);

    });

}


// ===================================
// MY COUNTRIES
// ===================================

function renderCountries(memories) {

    countryList.innerHTML = "";

    const countries = {};

    memories.forEach(memory => {

        const key = memory.country.toLowerCase();

        if (!countries[key]) {

            countries[key] = {
                name: memory.country,
                cities: new Set()
            };

        }

        countries[key].cities.add(memory.city.toLowerCase());

    });

    const countryEntries = Object.values(countries);

    if (countryEntries.length === 0) {

        countryList.innerHTML = `
            <p class="empty-state">
                Your country collection is waiting for its first destination.
            </p>
        `;

        return;
    }

    countryEntries.forEach(country => {

        const item = document.createElement("div");
        item.className = "country-item";

        const cityCount = country.cities.size;

        item.innerHTML = `
            <span>🌍</span>

            <div>
                <h3>${escapeHTML(country.name)}</h3>
                <p>${cityCount} ${cityCount === 1 ? "city" : "cities"} explored</p>
            </div>
        `;

        countryList.appendChild(item);

    });

}


// ===================================
// RENDER DASHBOARD
// ===================================

function renderDashboard() {

    const memories = TravelmoryData.getAll();

    renderStatistics(memories);
    renderRecentMemories(memories);
    renderCountries(memories);

}


// Load saved data when the page opens
renderDashboard();

