/**
 * Storage Service for 3D bin packing and container management
 * This service optimizes the placement of items within containers
 * using 3D bin packing algorithms
 */

class StorageService {
    constructor() {
      this.containers = new Map();
    }
  
    /**
     * Initialize containers in the storage service
     * @param {Array} containers - Array of container objects
     */
    initContainers(containers) {
      containers.forEach(container => {
        this.containers.set(container.containerId, {
          ...container,
          items: [],
          availableSpace: container.width * container.depth * container.height,
          utilized: 0
        });
      });
    }
  
    /**
     * Calculate optimal placements for a set of items
     * @param {Array} items - Array of item objects to place
     * @param {Array} containers - Array of container objects
     * @returns {Object} Object containing placement results
     */
    calculatePlacements(items, containers) {
      this.initContainers(containers);
      
      // Sort items by priority, expiry date, then volume (largest first)
      const sortedItems = [...items].sort((a, b) => {
        // Priority first (higher priority first)
        if (b.priority !== a.priority) return b.priority - a.priority;
        
        // Then expiry date (closest expiry first)
        const aExpiry = a.expiryDate ? new Date(a.expiryDate) : new Date(9999, 11, 31);
        const bExpiry = b.expiryDate ? new Date(b.expiryDate) : new Date(9999, 11, 31);
        if (aExpiry.getTime() !== bExpiry.getTime()) return aExpiry - bExpiry;
        
        // Then volume (largest first)
        const aVolume = a.width * a.depth * a.height;
        const bVolume = b.width * b.depth * b.height;
        return bVolume - aVolume;
      });
  
      const placements = [];
      const rearrangements = [];
      const unplacedItems = [];
  
      // Place items one by one
      for (const item of sortedItems) {
        const placement = this.findOptimalPlacement(item);
        
        if (placement) {
          placements.push(placement);
          this.updateContainerState(placement);
        } else {
          // Try rearranging to fit the item
          const rearrangement = this.tryRearrangement(item);
          if (rearrangement) {
            rearrangements.push(...rearrangement.steps);
            placements.push(rearrangement.placement);
            this.updateContainerState(rearrangement.placement);
          } else {
            unplacedItems.push(item);
          }
        }
      }
  
      return {
        success: unplacedItems.length === 0,
        placements,
        rearrangements,
        unplacedItems
      };
    }
  
    /**
     * Find the best placement for an item across all containers
     * @param {Object} item - Item to place
     * @returns {Object|null} Placement object or null if no placement found
     */
    findOptimalPlacement(item) {
      let bestPlacement = null;
      let bestScore = -Infinity;
  
      // First try containers in the preferred zone
      for (const [containerId, container] of this.containers) {
        if (container.zone === item.preferredZone) {
          const placement = this.findPlacementInContainer(item, container);
          if (placement) {
            const score = this.scorePlacement(placement, container, item);
            if (score > bestScore) {
              bestScore = score;
              bestPlacement = placement;
            }
          }
        }
      }
  
      // If no placement found in preferred zone, try other zones
      if (!bestPlacement) {
        for (const [containerId, container] of this.containers) {
          if (container.zone !== item.preferredZone) {
            const placement = this.findPlacementInContainer(item, container);
            if (placement) {
              const score = this.scorePlacement(placement, container, item);
              if (score > bestScore) {
                bestScore = score;
                bestPlacement = placement;
              }
            }
          }
        }
      }
  
      return bestPlacement;
    }
  
    /**
     * Find a valid placement for an item in a specific container
     * @param {Object} item - Item to place
     * @param {Object} container - Container to place in
     * @returns {Object|null} Placement object or null if no placement found
     */
    findPlacementInContainer(item, container) {
      const possibleRotations = this.generateRotations(item, container);
      
      for (const rotation of possibleRotations) {
        const position = this.findPosition(rotation, container);
        if (position) {
          return {
            itemId: item.itemId,
            containerId: container.containerId,
            position: {
              startCoordinates: position,
              endCoordinates: {
                width: position.width + rotation.width,
                depth: position.depth + rotation.depth,
                height: position.height + rotation.height
              }
            }
          };
        }
      }
      
      return null;
    }
  
    /**
     * Generate all valid rotations of an item that fit in the container
     * @param {Object} item - Item to rotate
     * @param {Object} container - Container to fit in
     * @returns {Array} Array of valid rotated item dimensions
     */
    generateRotations(item, container) {
      const rotations = [
        { width: item.width, depth: item.depth, height: item.height },
        { width: item.width, depth: item.height, height: item.depth },
        { width: item.depth, depth: item.width, height: item.height },
        { width: item.depth, depth: item.height, height: item.width },
        { width: item.height, depth: item.width, height: item.depth },
        { width: item.height, depth: item.depth, height: item.width }
      ];
      
      return rotations.filter(r => 
        r.width <= container.width && 
        r.depth <= container.depth && 
        r.height <= container.height
      );
    }
  
    /**
     * Find a valid position for an item in a container
     * @param {Object} itemDimensions - Dimensions of the item
     * @param {Object} container - Container to place in
     * @returns {Object|null} Position coordinates or null if no position found
     */
    findPosition(itemDimensions, container) {
      if (!container.items || container.items.length === 0) {
        // Container is empty, place at origin
        return { width: 0, depth: 0, height: 0 };
      }
      
      // Check each potential position using bottom-left-back strategy
      // This starts placing items from the back-left corner and builds forward
      const positions = this.generateCandidatePositions(container);
      
      for (const position of positions) {
        if (this.canPlaceItemAt(position, itemDimensions, container)) {
          return position;
        }
      }
      
      return null;
    }
  
    /**
     * Generate candidate positions for item placement in a container
     * @param {Object} container - Container to place in
     * @returns {Array} Array of potential positions
     */
    generateCandidatePositions(container) {
      const positions = [];
      
      // Add origin if container is empty
      if (container.items.length === 0) {
        positions.push({ width: 0, depth: 0, height: 0 });
        return positions;
      }
      
      // For each item in the container, generate potential positions at its corners
      for (const existingItem of container.items) {
        const itemPos = existingItem.position;
        
        // Position to the right of the item
        positions.push({
          width: itemPos.endCoordinates.width,
          depth: itemPos.startCoordinates.depth,
          height: itemPos.startCoordinates.height
        });
        
        // Position in front of the item
        positions.push({
          width: itemPos.startCoordinates.width,
          depth: itemPos.endCoordinates.depth,
          height: itemPos.startCoordinates.height
        });
        
        // Position on top of the item
        positions.push({
          width: itemPos.startCoordinates.width,
          depth: itemPos.startCoordinates.depth,
          height: itemPos.endCoordinates.height
        });
      }
      
      // Sort positions by proximity to the origin (back-left-bottom corner)
      return positions.sort((a, b) => {
        const aDistance = a.depth + a.width + a.height;
        const bDistance = b.depth + b.width + b.height;
        return aDistance - bDistance;
      });
    }
  
    /**
     * Check if an item can be placed at a specific position
     * @param {Object} position - Position coordinates
     * @param {Object} itemDimensions - Dimensions of the item
     * @param {Object} container - Container to place in
     * @returns {Boolean} True if the item can be placed at the position
     */
    canPlaceItemAt(position, itemDimensions, container) {
      // Check if item fits within container bounds
      if (
        position.width + itemDimensions.width > container.width ||
        position.depth + itemDimensions.depth > container.depth ||
        position.height + itemDimensions.height > container.height
      ) {
        return false;
      }
      
      // Check for overlaps with existing items
      for (const existingItem of container.items) {
        if (this.checkOverlap(
          position,
          {
            width: position.width + itemDimensions.width,
            depth: position.depth + itemDimensions.depth,
            height: position.height + itemDimensions.height
          },
          existingItem.position.startCoordinates,
          existingItem.position.endCoordinates
        )) {
          return false;
        }
      }
      
      return true;
    }
  
    /**
     * Check if two 3D boxes overlap
     * @param {Object} start1 - Start coordinates of box 1
     * @param {Object} end1 - End coordinates of box 1
     * @param {Object} start2 - Start coordinates of box 2
     * @param {Object} end2 - End coordinates of box 2
     * @returns {Boolean} True if the boxes overlap
     */
    checkOverlap(start1, end1, start2, end2) {
      return (
        start1.width < end2.width &&
        end1.width > start2.width &&
        start1.depth < end2.depth &&
        end1.depth > start2.depth &&
        start1.height < end2.height &&
        end1.height > start2.height
      );
    }
  
    /**
     * Score a placement based on how good it is
     * @param {Object} placement - Placement object
     * @param {Object} container - Container object
     * @param {Object} item - Item object
     * @returns {Number} Score value (higher is better)
     */
    scorePlacement(placement, container, item) {
      // Prioritize preferred zone placements
      const zoneScore = container.zone === item.preferredZone ? 100 : 0;
      
      // Calculate proximity to origin (back-left-bottom)
      const position = placement.position.startCoordinates;
      const proximityScore = 50 - (position.width + position.depth + position.height) / 10;
      
      // Calculate space utilization
      const itemVolume = item.width * item.depth * item.height;
      const containerVolume = container.width * container.depth * container.height;
      const utilizationScore = 30 * (container.utilized + itemVolume) / containerVolume;
      
      return zoneScore + proximityScore + utilizationScore;
    }
  
    /**
     * Attempt to rearrange items to fit a new item
     * @param {Object} item - Item to place
     * @returns {Object|null} Rearrangement plan or null if not possible
     */
    tryRearrangement(item) {
      // This is a simplified rearrangement strategy
      // A full implementation would use more sophisticated algorithms
      
      // For each container, try removing the smallest item and see if the new item fits
      for (const [containerId, container] of this.containers) {
        if (container.items.length === 0) continue;
        
        // Find the smallest item in the container
        const smallestItem = [...container.items].sort((a, b) => {
          const volumeA = (a.position.endCoordinates.width - a.position.startCoordinates.width) *
                         (a.position.endCoordinates.depth - a.position.startCoordinates.depth) *
                         (a.position.endCoordinates.height - a.position.startCoordinates.height);
          const volumeB = (b.position.endCoordinates.width - b.position.startCoordinates.width) *
                         (b.position.endCoordinates.depth - b.position.startCoordinates.depth) *
                         (b.position.endCoordinates.height - b.position.startCoordinates.height);
          return volumeA - volumeB;
        })[0];
        
        // Remove the smallest item temporarily
        const removedItem = smallestItem;
        const removedItemIndex = container.items.findIndex(i => i.position === removedItem.position);
        container.items.splice(removedItemIndex, 1);
        
        // Try to place the new item
        const placement = this.findPlacementInContainer(item, container);
        
        // Put back the removed item
        container.items.splice(removedItemIndex, 0, removedItem);
        
        if (placement) {
          // If the new item fits, create a rearrangement plan
          return {
            placement,
            steps: [
              {
                step: 1,
                action: "remove",
                itemId: removedItem.itemId,
                fromContainer: containerId,
                fromPosition: removedItem.position
              },
              {
                step: 2,
                action: "place",
                itemId: item.itemId,
                toContainer: containerId,
                toPosition: placement.position
              },
              {
                step: 3,
                action: "move",
                itemId: removedItem.itemId,
                fromContainer: containerId,
                toContainer: containerId,
                toPosition: removedItem.position
              }
            ]
          };
        }
      }
      
      return null;
    }
  
    /**
     * Update container state after placing an item
     * @param {Object} placement - Placement object
     */
    updateContainerState(placement) {
      const container = this.containers.get(placement.containerId);
      
      if (!container) return;
      
      // Calculate item volume
      const position = placement.position;
      const itemWidth = position.endCoordinates.width - position.startCoordinates.width;
      const itemDepth = position.endCoordinates.depth - position.startCoordinates.depth;
      const itemHeight = position.endCoordinates.height - position.startCoordinates.height;
      const itemVolume = itemWidth * itemDepth * itemHeight;
      
      // Update container
      container.items.push({
        itemId: placement.itemId,
        position: placement.position
      });
      
      container.utilized += itemVolume;
      container.availableSpace -= itemVolume;
    }
  
    /**
     * Get container utilization statistics
     * @returns {Array} Array of container utilization objects
     */
    getContainerUtilization() {
      const utilization = [];
      
      for (const [containerId, container] of this.containers) {
        const totalVolume = container.width * container.depth * container.height;
        const utilizationPercentage = (container.utilized / totalVolume) * 100;
        
        utilization.push({
          containerId,
          zone: container.zone,
          totalVolume,
          usedVolume: container.utilized,
          availableVolume: container.availableSpace,
          utilizationPercentage: parseFloat(utilizationPercentage.toFixed(2))
        });
      }
      
      return utilization;
    }
  }
  
  module.exports = StorageService;
  