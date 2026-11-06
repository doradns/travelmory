
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
// SAVE MEMORY
// ==========================================

memoryForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!selectedStartDate || !selectedEndDate) {
        dateRangeHint.textContent =
            "Please select both your arrival and departure dates.";

        dateRangeCalendar.hidden = false;
        renderCalendar();

        return;
    }

    const newMemory = {
        country: document.getElementById("country").value.trim(),
        city: document.getElementById("city").value.trim(),
        startDate: selectedStartDate,
        endDate: selectedEndDate,
        rating: Number(document.getElementById("rating").value),
        notes: document.getElementById("notes").value.trim()
    };

    TravelmoryData.add(newMemory);

    memoryForm.reset();

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
    const countries = new Set(
        memories.map(memory => memory.country)
    );

    const cities = getUniqueCities(memories);

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
            "<p class='empty-state'>Your travel memories will appear here.</p>";
        return;
    }

    recentGrid.innerHTML = sortedMemories.map(memory => `
        <article class="memory-card">
            <div class="memory-card-content">
                <h3>${escapeHTML(memory.city)}</h3>
                <p>${escapeHTML(memory.country)}</p>
                <span>${escapeHTML(formatDateRange(memory))}</span>

                <div class="memory-rating">
                    ${"★".repeat(Number(memory.rating) || 0)}
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
