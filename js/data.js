
const TravelmoryData = (() => {
    const STORAGE_KEY = "travelmory-memories";

    // Load all saved memories
    function getAll() {
        try {
            const memories =
                JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

            // Keep older memories compatible with the new date range
           return memories.map(memory => ({
    ...memory,
    countryCode: memory.countryCode || "",
    startDate: memory.startDate || memory.visitDate || "",
    endDate: memory.endDate || memory.visitDate || "",
    tripStatus: memory.tripStatus || "visited",
    rating: memory.rating === "" ? null : memory.rating
}));

        } catch (error) {
            console.error("Could not load memories:", error);
            return [];
        }
    }

    // Save all memories
    function saveAll(memories) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
    }

    // Add a new travel memory
    function add(memory) {
        const memories = getAll();

console.log("STATUS RECEIVED BY DATA.JS:", memory.tripStatus);

const newMemory = {
    id: crypto.randomUUID(),
    country: memory.country,
    countryCode: memory.countryCode || "",
    city: memory.city,
    startDate: memory.startDate,
    endDate: memory.endDate,
    tripStatus: memory.tripStatus || "visited",
    rating: memory.rating === "" || memory.rating === null
        ? null
        : Number(memory.rating),
    notes: memory.notes || "",
    isFavorite: false
};

        memories.push(newMemory);
        saveAll(memories);

        return newMemory;
    }

    // Delete a memory
    function remove(id) {
        const memories = getAll();

        const updatedMemories = memories.filter(
            memory => memory.id !== id
        );

        saveAll(updatedMemories);
    }

    // Update an existing memory
    function update(id, changes) {
        const memories = getAll();

        const updatedMemories = memories.map(memory =>
            memory.id === id
                ? { ...memory, ...changes }
                : memory
        );

        saveAll(updatedMemories);
    }

    return {
        getAll,
        add,
        remove,
        update
    };
})();
