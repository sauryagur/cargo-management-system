class Item {
    constructor({
                    itemId,
                    name,
                    width,
                    depth,
                    height,
                    priority,
                    expiryDate,
                    usageLimit,
                    preferredZone,
                    mass = 0
                }) {
        this.itemId = itemId;
        this.name = name;
        this.width = width;
        this.depth = depth;
        this.height = height;
        this.priority = priority;
        this.expiryDate = expiryDate; // ISO format date string
        this.usageLimit = usageLimit;
        this.preferredZone = preferredZone;
        this.mass = mass;

        // Additional properties for tracking
        this.currentUses = 0;
        this.isWaste = false;
        this.containerId = null;
        this.position = null;
    }

    // Check if item is expired based on current date
    isExpired(currentDate) {
        if (!this.expiryDate) return false;
        return new Date(currentDate) > new Date(this.expiryDate);
    }

    // Check if item is out of uses
    isOutOfUses() {
        return this.usageLimit !== null && this.currentUses >= this.usageLimit;
    }

    // Check if item should be considered waste
    checkWasteStatus(currentDate) {
        return this.isExpired(currentDate) || this.isOutOfUses();
    }

    // Use the item once
    use() {
        this.currentUses++;
        return this.currentUses;
    }

    // Get volume of the item
    getVolume() {
        return this.width * this.depth * this.height;
    }
}

module.exports = Item;
