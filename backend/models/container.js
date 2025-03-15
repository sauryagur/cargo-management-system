class Container {
    constructor({
                    containerId,
                    zone,
                    width,
                    depth,
                    height
                }) {
        this.containerId = containerId;
        this.zone = zone;
        this.width = width;
        this.depth = depth;
        this.height = height;

        // Initialize occupancy grid
        this.grid = this.initializeGrid();

        // Track items in this container
        this.items = new Map(); // itemId -> {item, position}
    }

    // Initialize a 3D grid to track occupied space
    initializeGrid() {
        // For simplicity, we'll create a grid with 1cm resolution
        // In a real system, you might want a more efficient representation
        const grid = new Array(Math.ceil(this.width));

        for (let w = 0; w < grid.length; w++) {
            grid[w] = new Array(Math.ceil(this.depth));

            for (let d = 0; d < grid[w].length; d++) {
                grid[w][d] = new Array(Math.ceil(this.height)).fill(false);
            }
        }

        return grid;
    }

    // Check if a specific cell is occupied
    isOccupied(w, d, h) {
        if (w < 0 || w >= this.width ||
            d < 0 || d >= this.depth ||
            h < 0 || h >= this.height) {
            return true; // Out of bounds is considered occupied
        }
        return this.grid[Math.floor(w)][Math.floor(d)][Math.floor(h)];
    }

    // Mark a region as occupied by an item
    occupySpace(startW, startD, startH, endW, endD, endH, itemId) {
        for (let w = Math.floor(startW); w < Math.ceil(endW); w++) {
            for (let d = Math.floor(startD); d < Math.ceil(endD); d++) {
                for (let h = Math.floor(startH); h < Math.ceil(endH); h++) {
                    if (w < this.width && d < this.depth && h < this.height) {
                        this.grid[w][d][h] = itemId;
                    }
                }
            }
        }
    }

    // Free space occupied by an item
    freeSpace(startW, startD, startH, endW, endD, endH) {
        for (let w = Math.floor(startW); w < Math.ceil(endW); w++) {
            for (let d = Math.floor(startD); d < Math.ceil(endD); d++) {
                for (let h = Math.floor(startH); h < Math.ceil(endH); h++) {
                    if (w < this.width && d < this.depth && h < this.height) {
                        this.grid[w][d][h] = false;
                    }
                }
            }
        }
    }

    // Get all items that are directly accessible from the open face
    getAccessibleItems() {
        const accessible = new Set();

        // Check front face (at depth = 0)
        for (let w = 0; w < this.width; w++) {
            for (let h = 0; h < this.height; h++) {
                if (this.grid[w][0][h]) {
                    accessible.add(this.grid[w][0][h]);
                }
            }
        }

        return Array.from(accessible);
    }

    // Find items blocking access to a specific item
    findBlockingItems(itemId) {
        const item = this.items.get(itemId);
        if (!item) return [];

        const {startCoordinates, endCoordinates} = item.position;
        const blocking = new Set();

        // Check all items between this item and the open face
        for (let w = Math.floor(startCoordinates.width); w < Math.ceil(endCoordinates.width); w++) {
            for (let h = Math.floor(startCoordinates.height); h < Math.ceil(endCoordinates.height); h++) {
                for (let d = 0; d < Math.floor(startCoordinates.depth); d++) {
                    const blockingItemId = this.grid[w][d][h];
                    if (blockingItemId && blockingItemId !== itemId) {
                        blocking.add(blockingItemId);
                    }
                }
            }
        }

        return Array.from(blocking);
    }

    // Check if an item can fit at a specific position
    canItemFit(width, depth, height, startW, startD, startH) {
        // Check if the item dimensions exceed container dimensions
        if (startW + width > this.width ||
            startD + depth > this.depth ||
            startH + height > this.height) {
            return false;
        }

        // Check if any cell in the target region is already occupied
        for (let w = Math.floor(startW); w < Math.ceil(startW + width); w++) {
            for (let d = Math.floor(startD); d < Math.ceil(startD + depth); d++) {
                for (let h = Math.floor(startH); h < Math.ceil(startH + height); h++) {
                    if (this.isOccupied(w, d, h)) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    // Find possible positions for an item, sorted by accessibility
    findPositionsForItem(width, depth, height) {
        const positions = [];

        // Try all possible starting positions
        for (let startW = 0; startW <= this.width - width; startW++) {
            for (let startD = 0; startD <= this.depth - depth; startD++) {
                for (let startH = 0; startH <= this.height - height; startH++) {
                    if (this.canItemFit(width, depth, height, startW, startD, startH)) {
                        const position = {
                            startCoordinates: {width: startW, depth: startD, height: startH},
                            endCoordinates: {width: startW + width, depth: startD + depth, height: startH + height}
                        };

                        // Calculate accessibility score (lower is better)
                        // We prioritize positions closer to the open face (depth = 0)
                        const accessibilityScore = startD;

                        positions.push({position, accessibilityScore});
                    }
                }
            }
        }

        // Sort by accessibility (closer to open face is better)
        return positions.sort((a, b) => a.accessibilityScore - b.accessibilityScore);
    }

    // Place an item in the container
    placeItem(item, position) {
        const {startCoordinates, endCoordinates} = position;

        // Mark space as occupied
        this.occupySpace(
            startCoordinates.width, startCoordinates.depth, startCoordinates.height,
            endCoordinates.width, endCoordinates.depth, endCoordinates.height,
            item.itemId
        );

        // Store item in container's item map
        this.items.set(item.itemId, {item, position});

        // Update item's container reference
        item.containerId = this.containerId;
        item.position = position;

        return true;
    }

    // Remove an item from the container
    removeItem(itemId) {
        const itemData = this.items.get(itemId);
        if (!itemData) return null;

        const {item, position} = itemData;
        const {startCoordinates, endCoordinates} = position;

        // Free occupied space
        this.freeSpace(
            startCoordinates.width, startCoordinates.depth, startCoordinates.height,
            endCoordinates.width, endCoordinates.depth, endCoordinates.height
        );

        // Remove from items map
        this.items.delete(itemId);

        // Clear item's container reference
        item.containerId = null;
        item.position = null;

        return item;
    }

    // Calculate total volume of the container
    getTotalVolume() {
        return this.width * this.depth * this.height;
    }

    // Calculate used volume
    getUsedVolume() {
        let usedVolume = 0;

        for (const {item} of this.items.values()) {
            usedVolume += item.getVolume();
        }

        return usedVolume;
    }

    // Calculate free volume
    getFreeVolume() {
        return this.getTotalVolume() - this.getUsedVolume();
    }
}

module.exports = Container;
