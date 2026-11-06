
// ===================================
// TRAVELMORY — DATA MANAGEMENT
// ===================================

const TravelmoryData = (() => {

    const STORAGE_KEY = "travelmory-memories";

    // Load all saved memories
    function getAll() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch (error) {
            console.error("Could not load memories:", error);
            return [];
        }
    }

    // Save memories to browser storage
    function saveAll(memories) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(memories)
        );
    }

    // Add a new memory
    function add(memory) {
        const memories = getAll();

        memories.push({
            id: Date.now().toString(),
            ...memory
        });

        saveAll(memories);
    }

    return {
        getAll,
        add
    };

})();

