
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

    // Save all memories
    function saveAll(memories) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
    }

    // Add a new travel memory
    function add(memory) {
        const memories = getAll();

        const newMemory = {
            id: crypto.randomUUID(),
            country: memory.country,
            city: memory.city,
            visitDate: memory.visitDate,
            rating: Number(memory.rating),
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
