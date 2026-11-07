
// ==========================================
// TRAVELMORY — APP
// ==========================================

// DOM elements
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

// Date range calendar elements
const dateRangeTrigger = document.getElementById("dateRangeTrigger");
const dateRangeCalendar = document.getElementById("dateRangeCalendar");
const dateRangeLabel = document.getElementById("dateRangeLabel");
const calendarMonths = document.getElementById("calendarMonths");
const prevMonthButton = document.getElementById("prevMonth");
const nextMonthButton = document.getElementById("nextMonth");
const dateRangeHint = document.getElementById("dateRangeHint");

const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");


// ==========================================
// DIALOG
// ==========================================

addMemoryButton.addEventListener("click", () => {
    memoryDialog.showModal();
});

closeDialog.addEventListener("click", () => {
    memoryDialog.close();
});


// ==========================================
// DATE RANGE CALENDAR
// ==========================================

let calendarDate = new Date();
calendarDate.setDate(1);

let selectedStartDate = "";
let selectedEndDate = "";

const monthFormatter = new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric"
});

function dateToString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function parseDate(dateString) {
    if (!dateString) return null;

    const [year, month, day] = dateString.split("-").map(Number);

    return new Date(year, month - 1, day);
}

function formatDate(dateString) {
    const date = parseDate(dateString);

    if (!date) return "Date not specified";

    return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

function formatDateRange(memory) {
    const start = memory.startDate || memory.visitDate || "";
    const end = memory.endDate || memory.visitDate || start;

    if (!start) return "Date not specified";

    if (!end || start === end) {
        return formatDate(start);
    }

    const startDate = parseDate(start);
    const endDate = parseDate(end);

    if (
        startDate.getMonth() === endDate.getMonth() &&
        startDate.getFullYear() === endDate.getFullYear()
    ) {
        const monthYear = endDate.toLocaleDateString("en-GB", {
            month: "short",
            year: "numeric"
        });

        return `${startDate.getDate()}–${endDate.getDate()} ${monthYear}`;
    }

    return `${formatDate(start)} – ${formatDate(end)}`;
}

function updateDateRangeLabel() {
    if (!selectedStartDate) {
        dateRangeLabel.textContent = "Select travel dates";
        startDateInput.value = "";
        endDateInput.value = "";
        return;
    }

    startDateInput.value = selectedStartDate;
    endDateInput.value = selectedEndDate;

    if (!selectedEndDate) {
        dateRangeLabel.textContent =
            `${formatDate(selectedStartDate)} – Select end date`;
        return;
    }

    dateRangeLabel.textContent =
        `${formatDate(selectedStartDate)} – ${formatDate(selectedEndDate)}`;
}

function renderCalendarMonth(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const monthContainer = document.createElement("div");
    monthContainer.className = "calendar-month";

    const heading = document.createElement("h3");
    heading.textContent = monthFormatter.format(firstDay);
    monthContainer.appendChild(heading);

    const weekdays = document.createElement("div");
    weekdays.className = "calendar-weekdays";

    ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach(day => {
        const dayElement = document.createElement("span");
        dayElement.textContent = day;
        weekdays.appendChild(dayElement);
    });

    monthContainer.appendChild(weekdays);

    const daysContainer = document.createElement("div");
    daysContainer.className = "calendar-days";

    // Monday = 0, Sunday = 6
    const startingDay = (firstDay.getDay() + 6) % 7;

    for (let i = 0; i < startingDay; i++) {
        const emptyDay = document.createElement("span");
        emptyDay.className = "calendar-day empty";
        daysContainer.appendChild(emptyDay);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day);
        const dateString = dateToString(date);

        const button = document.createElement("button");
        button.type = "button";
        button.className = "calendar-day";
        button.textContent = day;
        button.dataset.date = dateString;

        if (dateString === selectedStartDate) {
            button.classList.add("selected", "range-start");
        }

        if (dateString === selectedEndDate) {
            button.classList.add("selected", "range-end");
        }

        if (
            selectedStartDate &&
            selectedEndDate &&
            dateString > selectedStartDate &&
            dateString < selectedEndDate
        ) {
            button.classList.add("in-range");
        }

        button.addEventListener("click", () => {
            selectCalendarDate(dateString);
        });

        daysContainer.appendChild(button);
    }

    monthContainer.appendChild(daysContainer);

    return monthContainer;
}

function renderCalendar() {
    calendarMonths.innerHTML = "";

    const firstMonth = new Date(
        calendarDate.getFullYear(),
        calendarDate.getMonth(),
        1
    );

    const secondMonth = new Date(
        calendarDate.getFullYear(),
        calendarDate.getMonth() + 1,
        1
    );

    calendarMonths.appendChild(
        renderCalendarMonth(
            firstMonth.getFullYear(),
            firstMonth.getMonth()
        )
    );

    calendarMonths.appendChild(
        renderCalendarMonth(
            secondMonth.getFullYear(),
            secondMonth.getMonth()
        )
    );
}

function selectCalendarDate(dateString) {
    // Start a new selection
    if (!selectedStartDate || selectedEndDate) {
        selectedStartDate = dateString;
        selectedEndDate = "";
        dateRangeHint.textContent =
            "Now select your departure date.";
    }

    // If the second date is earlier, use it as the new start
    else if (dateString < selectedStartDate) {
        selectedStartDate = dateString;
        selectedEndDate = "";
        dateRangeHint.textContent =
            "Now select your departure date.";
    }

    // Complete the date range
    else {
        selectedEndDate = dateString;
        dateRangeHint.textContent = "Your travel dates are selected.";
    }

    updateDateRangeLabel();
    renderCalendar();

    // Close the calendar after both dates have been selected
    if (selectedStartDate && selectedEndDate) {
        dateRangeCalendar.hidden = true;
    }
}

dateRangeTrigger.addEventListener("click", () => {
    dateRangeCalendar.hidden = !dateRangeCalendar.hidden;

    if (!dateRangeCalendar.hidden) {
        renderCalendar();
    }
});

prevMonthButton.addEventListener("click", () => {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    renderCalendar();
});

nextMonthButton.addEventListener("click", () => {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    renderCalendar();
});


// ==========================================
// COUNTRY & CITY AUTOCOMPLETE
// ==========================================

const countryInput = document.getElementById("country");
const countryCodeInput = document.getElementById("countryCode");
const cityInput = document.getElementById("city");

const countrySuggestions = document.getElementById("countrySuggestions");
const citySuggestions = document.getElementById("citySuggestions");

let selectedCountryCode = "";
let selectedCityName = "";

let countrySearchTimeout;
let citySearchTimeout;

const PHOTON_API = "https://photon.komoot.io/api/";


// Fetch suggestions from Photon
async function searchPhoton(params) {
    const url = `${PHOTON_API}?${params.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Could not load location suggestions.");
    }

    return response.json();
}


// Show a message inside a suggestion list
function showSuggestionMessage(container, message) {
    container.innerHTML = "";

    const messageElement = document.createElement("div");
    messageElement.className = "autocomplete-empty";
    messageElement.textContent = message;

    container.appendChild(messageElement);
    container.hidden = false;
}


// Hide suggestion lists
function hideAutocompleteSuggestions() {
    countrySuggestions.hidden = true;
    citySuggestions.hidden = true;
}


// ==========================================
// COUNTRY SEARCH
// ==========================================

async function searchCountries(query) {
    const params = new URLSearchParams();

    params.set("q", query);
    params.set("limit", "10");
    params.set("lang", "en");
    params.append("layer", "country");

    try {
        const data = await searchPhoton(params);

        // Ignore outdated results if the user has typed more
        if (countryInput.value.trim() !== query) return;

        const countries = new Map();

        data.features.forEach(feature => {
            const properties = feature.properties;
            const name = properties.name;
            const code = properties.countrycode;

            if (name && code && !countries.has(code)) {
                countries.set(code, {
                    name,
                    code
                });
            }
        });

        countrySuggestions.innerHTML = "";

        if (countries.size === 0) {
            showSuggestionMessage(
                countrySuggestions,
                "No countries found."
            );
            return;
        }

        countries.forEach(country => {
            const button = document.createElement("button");

            button.type = "button";
            button.className = "autocomplete-option";

            const name = document.createElement("strong");
            name.textContent = country.name;

            const code = document.createElement("span");
            code.textContent = country.code;

            button.appendChild(name);
            button.appendChild(code);

            button.addEventListener("click", () => {
                selectCountry(country);
            });

            countrySuggestions.appendChild(button);
        });

        countrySuggestions.hidden = false;

    } catch (error) {
        console.error("Country search failed:", error);

        showSuggestionMessage(
            countrySuggestions,
            "Could not load countries. Please try again."
        );
    }
}


function selectCountry(country) {
    countryInput.value = country.name;
    countryCodeInput.value = country.code;

    selectedCountryCode = country.code;

    countrySuggestions.hidden = true;

    // Reset city whenever the country changes
    cityInput.value = "";
    selectedCityName = "";

    cityInput.disabled = false;
    cityInput.placeholder = "Search for a city...";

    citySuggestions.hidden = true;

    cityInput.focus();
}


countryInput.addEventListener("input", () => {
    // Typing means the previous country selection is no longer valid
    selectedCountryCode = "";
    countryCodeInput.value = "";

    selectedCityName = "";

    cityInput.value = "";
    cityInput.disabled = true;
    cityInput.placeholder = "Select a country first";

    citySuggestions.hidden = true;

    clearTimeout(countrySearchTimeout);

    const query = countryInput.value.trim();

    if (query.length < 2) {
        countrySuggestions.hidden = true;
        return;
    }

    countrySearchTimeout = setTimeout(() => {
        searchCountries(query);
    }, 350);
});


// ==========================================
// CITY SEARCH
// ==========================================

async function searchCities(query) {
    if (!selectedCountryCode) return;

    const countryCode = selectedCountryCode;

    const params = new URLSearchParams();

    params.set("q", query);
    params.set("countrycode", countryCode);
    params.set("limit", "10");
    params.set("lang", "en");

    params.append("layer", "city");
    params.append("layer", "locality");

    try {
        const data = await searchPhoton(params);

        // Ignore outdated results or a changed country
        if (
            cityInput.value.trim() !== query ||
            selectedCountryCode !== countryCode
        ) {
            return;
        }

        // Keep only results belonging to the selected country
        const cities = new Map();

        data.features.forEach(feature => {
            const properties = feature.properties;

            const name = properties.name;
            const resultCountryCode =
                properties.countrycode?.toUpperCase();

            if (
                name &&
                resultCountryCode === countryCode.toUpperCase()
            ) {
                const state = properties.state || properties.county || "";

                const key = `${name}-${state}`;

                if (!cities.has(key)) {
                    cities.set(key, {
                        name,
                        state
                    });
                }
            }
        });

        citySuggestions.innerHTML = "";

        if (cities.size === 0) {
            showSuggestionMessage(
                citySuggestions,
                "No cities found in this country."
            );
            return;
        }

        cities.forEach(city => {
            const button = document.createElement("button");

            button.type = "button";
            button.className = "autocomplete-option";

            const name = document.createElement("strong");
            name.textContent = city.name;

            button.appendChild(name);

            if (city.state) {
                const location = document.createElement("span");
                location.textContent = city.state;

                button.appendChild(location);
            }

            button.addEventListener("click", () => {
                selectCity(city);
            });

            citySuggestions.appendChild(button);
        });

        citySuggestions.hidden = false;

    } catch (error) {
        console.error("City search failed:", error);

        showSuggestionMessage(
            citySuggestions,
            "Could not load cities. Please try again."
        );
    }
}


function selectCity(city) {
    cityInput.value = city.name;
    selectedCityName = city.name;

    citySuggestions.hidden = true;
}


cityInput.addEventListener("input", () => {
    selectedCityName = "";

    clearTimeout(citySearchTimeout);

    const query = cityInput.value.trim();

    if (!selectedCountryCode || query.length < 2) {
        citySuggestions.hidden = true;
        return;
    }

    citySearchTimeout = setTimeout(() => {
        searchCities(query);
    }, 350);
});


// ==========================================
// CLOSE SUGGESTIONS WHEN CLICKING OUTSIDE
// ==========================================

document.addEventListener("click", event => {
    if (!event.target.closest(".autocomplete-wrapper")) {
        hideAutocompleteSuggestions();
    }
});



// ==========================================
// SAVE MEMORY
// ==========================================

memoryForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Make sure a country was selected from the suggestions
    if (!selectedCountryCode) {
        countryInput.focus();
        return;
    }

    // Make sure a city was selected from the suggestions
    if (
        !selectedCityName ||
        cityInput.value.trim() !== selectedCityName
    ) {
        cityInput.focus();
        return;
    }

    // Make sure both travel dates are selected
    if (!selectedStartDate || !selectedEndDate) {
        dateRangeHint.textContent =
            "Please select both your arrival and departure dates.";

        dateRangeCalendar.hidden = false;
        renderCalendar();

        return;
    }

const newMemory = {
    country: countryInput.value.trim(),
    city: cityInput.value.trim(),
    startDate: selectedStartDate,
    endDate: selectedEndDate,
    tripStatus: document.getElementById("tripStatus").value,
    rating: document.getElementById("rating").value === ""
        ? null
        : Number(document.getElementById("rating").value),
    notes: document.getElementById("notes").value.trim()
};

    TravelmoryData.add(newMemory);

    memoryForm.reset();

    // Reset country and city selection
    selectedCountryCode = "";
    selectedCityName = "";

    countryCodeInput.value = "";

    cityInput.disabled = true;
    cityInput.placeholder = "Select a country first";

    hideAutocompleteSuggestions();

    // Reset date selection
    selectedStartDate = "";
    selectedEndDate = "";

    updateDateRangeLabel();

    dateRangeHint.textContent =
        "Select your arrival and departure dates.";

    dateRangeCalendar.hidden = true;

    memoryDialog.close();

    renderDashboard();
});



// ==========================================
// HELPER FUNCTIONS
// ==========================================

function escapeHTML(value) {
    return String(value || "").replace(/[&<>"']/g, character => {
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

function sortMemories(memories) {
    return [...memories].sort((a, b) => {
        const dateA = a.startDate || a.visitDate || "";
        const dateB = b.startDate || b.visitDate || "";

        return dateB.localeCompare(dateA);
    });
}

function getUniqueCities(memories) {
    return new Set(memories.map(memory => memory.city));
}


// ==========================================
// STATISTICS
// ==========================================

function renderStatistics(memories) {
    // Only visited trips count as explored places
    const visitedTrips = memories.filter(
        memory => memory.tripStatus === "visited"
    );

    const countries = new Set(
        visitedTrips.map(memory => memory.country)
    );

    const cities = getUniqueCities(visitedTrips);

    countriesCount.textContent = countries.size;
    citiesCount.textContent = cities.size;
    memoriesCount.textContent = memories.length;
}


// ==========================================
// RECENT MEMORIES
// ==========================================

function renderRecentMemories(memories) {
    const sortedMemories = sortMemories(memories).slice(0, 6);

    if (sortedMemories.length === 0) {
        recentGrid.innerHTML =
            "<p class='empty-state'>Your trips will appear here.</p>";
        return;
    }

    recentGrid.innerHTML = sortedMemories.map(memory => {
        const statusLabel =
            memory.tripStatus === "planned" ? "Planned" : "Visited";

        const ratingHTML = memory.rating
            ? "★".repeat(Number(memory.rating))
            : "Not rated yet";

        return `
            <article class="memory-card">
                <div class="memory-card-content">
                    <span class="trip-status ${memory.tripStatus || "visited"}">
                        ${statusLabel}
                    </span>

                    <h3>${escapeHTML(memory.city)}</h3>
                    <p>${escapeHTML(memory.country)}</p>
                    <span>${escapeHTML(formatDateRange(memory))}</span>

                    <div class="memory-rating">
                        ${ratingHTML}
                    </div>

                    <p>${escapeHTML(memory.notes)}</p>

                    <div class="memory-actions">
                        <button
                            type="button"
                            data-action="favorite"
                            data-id="${escapeHTML(memory.id)}"
                            aria-label="Toggle favorite"
                        >
                            ${memory.isFavorite ? "♥" : "♡"}
                        </button>

                        <button
                            type="button"
                            data-action="delete"
                            data-id="${escapeHTML(memory.id)}"
                            aria-label="Delete trip"
                        >
                            ×
                        </button>
                    </div>
                </div>
            </article>
        `;
    }).join("");
}


// ==========================================
// COUNTRIES
// ==========================================

function renderCountries(memories) {
    const countries = {};

    memories.forEach(memory => {
        if (!countries[memory.country]) {
            countries[memory.country] = [];
        }

        countries[memory.country].push(memory.city);
    });

    const countryNames = Object.keys(countries).sort();

    if (countryNames.length === 0) {
        countryList.innerHTML =
            "<p class='empty-state'>Your country collection will grow here.</p>";
        return;
    }

    countryList.innerHTML = countryNames.map(country => {
        const cities = [...new Set(countries[country])].sort();

        return `
            <div class="country-item">
                <h3>${escapeHTML(country)}</h3>
                <p>${cities.map(city => escapeHTML(city)).join(", ")}</p>
            </div>
        `;
    }).join("");
}


// ==========================================
// FAVORITES
// ==========================================

function renderFavorites(memories) {
    const favorites = sortMemories(
        memories.filter(memory => memory.isFavorite)
    );

    if (favorites.length === 0) {
        favoritesGrid.innerHTML =
            "<p class='empty-state'>Your favorite memories will appear here.</p>";
        return;
    }

    favoritesGrid.innerHTML = favorites.map(memory => `
        <article class="memory-card favorite-card">
            <div class="memory-card-content">
                <h3>${escapeHTML(memory.city)}</h3>
                <p>${escapeHTML(memory.country)}</p>
                <p>${escapeHTML(formatDateRange(memory))}</p>

                <div class="memory-rating">
                    ${"★".repeat(Number(memory.rating) || 0)}
                </div>

                <p>${escapeHTML(memory.notes)}</p>

                <div class="memory-actions">
                    <button
                        type="button"
                        data-action="favorite"
                        data-id="${escapeHTML(memory.id)}"
                        aria-label="Remove from favorites"
                    >
                        ♥
                    </button>

                    <button
                        type="button"
                        data-action="delete"
                        data-id="${escapeHTML(memory.id)}"
                        aria-label="Delete memory"
                    >
                        ×
                    </button>
                </div>
            </div>
        </article>
    `).join("");
}


// ==========================================
// FEATURED DESTINATION
// ==========================================

function renderFeaturedDestination(memories) {
    const latestMemory = sortMemories(memories)[0];

    if (!latestMemory) {
        featuredDestination.innerHTML = `
            <div class="featured-content">
                <h2>Your next adventure awaits.</h2>
                <p>Add your first travel memory to get started.</p>
            </div>
        `;
        return;
    }

    featuredDestination.innerHTML = `
        <div class="featured-content">
            <h2>${escapeHTML(latestMemory.city)}</h2>
            <p>${escapeHTML(latestMemory.country)}</p>
            <p>Your visit: ${escapeHTML(formatDateRange(latestMemory))}</p>
        </div>
    `;
}


// ==========================================
// SEARCH
// ==========================================

function renderSearchResults() {
    const memories = TravelmoryData.getAll();
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (!searchTerm) {
        renderRecentMemories(memories);
        return;
    }

    const filteredMemories = memories.filter(memory => {
        return (
            String(memory.city || "").toLowerCase().includes(searchTerm) ||
            String(memory.country || "").toLowerCase().includes(searchTerm) ||
            String(memory.notes || "").toLowerCase().includes(searchTerm)
        );
    });

    renderRecentMemories(filteredMemories);
}


// ==========================================
// FAVORITE / DELETE ACTIONS
// ==========================================

document.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.action;

    if (action === "favorite") {
        const memory = TravelmoryData.getAll().find(
            item => item.id === id
        );

        if (memory) {
            TravelmoryData.update(id, {
                isFavorite: !memory.isFavorite
            });
        }
    }

    if (action === "delete") {
        const confirmed = confirm(
            "Are you sure you want to delete this memory?"
        );

        if (confirmed) {
            TravelmoryData.remove(id);
        }
    }

    renderDashboard();
});


// ==========================================
// DASHBOARD
// ==========================================

function renderDashboard() {
    const memories = TravelmoryData.getAll();

    renderStatistics(memories);
    renderFeaturedDestination(memories);
    renderSearchResults();
    renderCountries(memories);
    renderFavorites(memories);
}


// ==========================================
// EVENT LISTENERS & INITIAL LOAD
// ==========================================

searchInput.addEventListener("input", renderSearchResults);

renderCalendar();
renderDashboard();
updateDateRangeLabel();


// ==========================================
// TRAVEL MAP - INITIALIZATION
// ==========================================

const travelMapElement = document.getElementById("travelMap");

if (travelMapElement && typeof L !== "undefined") {

    // Create the world map
    const travelMap = L.map("travelMap", {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 6,
        worldCopyJump: true
    });

    // Add map tiles
    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            noWrap: true
        }
    ).addTo(travelMap);
}
