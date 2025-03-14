class Position {
    constructor(startCoordinates, endCoordinates) {
        this.startCoordinates = startCoordinates;
        this.endCoordinates = endCoordinates;
    }
}

class Coordinates {
    constructor(width, depth, height) {
        this.width = width;
        this.depth = depth;
        this.height = height;
    }
}

module.exports = {
    Position,
    Coordinates
};
