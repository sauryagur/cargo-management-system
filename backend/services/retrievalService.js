// backend/services/retrievalService.js
const { KDBush, KDBush3D } = require('kdbush');

class RetrievalOptimizer {
  constructor(containers) {
    this.containers = new Map();
    this.indices = new Map();
    
    containers.forEach(container => {
      const items = container.items.map(item => [
        item.position.startCoordinates.width,
        item.position.startCoordinates.depth,
        item.position.startCoordinates.height,
        item.position.endCoordinates.width,
        item.position.endCoordinates.depth,
        item.position.endCoordinates.height,
        item
      ]);
      
      // 3D spatial index for fast queries
      this.indices.set(container.containerId, new KDBush3D(
        items,
        p => p[0],  // minX
        p => p[1],  // minY (depth)
        p => p[2],  // minZ
        p => p[3],  // maxX
        p => p[4],  // maxY (depth)
        p => p[5]   // maxZ
      ));
      
      this.containers.set(container.containerId, {
        ...container,
        depthSorted: [...container.items].sort((a, b) => 
          a.position.startCoordinates.depth - b.position.startCoordinates.depth
        )
      });
    });
  }

  findOptimalItem(searchParams) {
    const candidates = this.findCandidates(searchParams);
    if (!candidates.length) return null;

    return candidates.reduce((best, current) => {
      const currentScore = this.calculateRetrievalScore(current);
      return currentScore > best.score ? 
        { item: current, score: currentScore } : 
        best;
    }, { score: -Infinity }).item;
  }

  findCandidates({ itemId, itemName }) {
    const results = [];
    
    for (const [containerId, index] of this.indices) {
      index.range(...this.getSearchBounds(), (minX, minY, minZ, maxX, maxY, maxZ, item) => {
        if (item.itemId === itemId || item.name === itemName) {
          results.push({
            item,
            container: this.containers.get(containerId),
            blockers: this.calculateBlockers(item, containerId)
          });
        }
      });
    }
    
    return results;
  }

  calculateBlockers(targetItem, containerId) {
    const container = this.containers.get(containerId);
    const blockers = [];
    const targetDepth = targetItem.position.startCoordinates.depth;
    
    // Use depth-sorted list for early termination
    for (const item of container.depthSorted) {
      if (item.itemId === targetItem.itemId) break;
      if (this.blocksItem(item, targetItem)) {
        blockers.push(item);
      }
    }
    
    return blockers;
  }

  blocksItem(blocker, target) {
    return blocker.position.startCoordinates.depth < target.position.endCoordinates.depth &&
      this.overlapsInDimensions(blocker, target);
  }

  overlapsInDimensions(a, b) {
    return a.position.startCoordinates.width < b.position.endCoordinates.width &&
      a.position.endCoordinates.width > b.position.startCoordinates.width &&
      a.position.startCoordinates.height < b.position.endCoordinates.height &&
      a.position.endCoordinates.height > b.position.startCoordinates.height;
  }

  calculateRetrievalScore({ item, blockers }) {
    // Priority (40%), accessibility (40%), urgency (20%)
    const priorityWeight = 0.4;
    const accessibilityWeight = 0.4 * Math.exp(-0.5 * blockers.length);
    const urgencyWeight = 0.2 * this.calculateUrgency(item);
    
    return priorityWeight * (item.priority / 100) +
      accessibilityWeight +
      urgencyWeight;
  }

  calculateUrgency(item) {
    if (!item.expiryDate) return 0;
    const daysRemaining = (new Date(item.expiryDate) - Date.now()) / (1000 * 3600 * 24);
    return Math.max(0, 1 - (daysRemaining / 30)); // Normalize to 30-day window
  }

  generateRetrievalPlan(target, blockers) {
    const steps = [];
    
    // Removal steps
    blockers.forEach((blocker, index) => {
      steps.push({
        step: index + 1,
        action: "setAside",
        itemId: blocker.itemId,
        itemName: blocker.name
      });
    });

    // Retrieval step
    steps.push({
      step: blockers.length + 1,
      action: "retrieve",
      itemId: target.itemId,
      itemName: target.name
    });

    // Replacement steps
    blockers.reverse().forEach((blocker, index) => {
      steps.push({
        step: blockers.length + 2 + index,
        action: "placeBack",
        itemId: blocker.itemId,
        itemName: blocker.name
      });
    });

    return steps;
  }
}

module.exports = RetrievalOptimizer;
