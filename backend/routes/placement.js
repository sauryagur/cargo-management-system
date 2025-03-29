const express = require('express');
const router = express.Router();
const StorageService = require('../services/storageService'); // Import the StorageService

// POST /api/placement
router.post('/', async (req, res) => {
  try {
    const { items, containers } = req.body;

    // Validate input
    if (!items || !Array.isArray(items) || !containers || !Array.isArray(containers)) {
      return res.status(400).json({ success: false, message: 'Invalid input format' });
    }

    // Initialize the storage service and calculate placements
    const storageService = new StorageService();
    const result = storageService.calculatePlacements(items, containers);

    // Return the result
    res.json({
      success: result.success,
      placements: result.placements,
      rearrangements: result.rearrangements,
      unplacedItems: result.unplacedItems,
      utilization: storageService.getContainerUtilization(),
    });
  } catch (error) {
    console.error('Error in placement:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
 

// Example Request Body:
// {
//     "items": [
//       {
//         "itemId": "item1",
//         "name": "Item 1",
//         "width": 5,
//         "depth": 5,
//         "height": 5,
//         "priority": 100,
//         "expiryDate": "2025-04-01T00:00:00Z",
//         "preferredZone": "A"
//       },
//       {
//         "itemId": "item2",
//         "name": "Item 2",
//         "width": 3,
//         "depth": 3,
//         "height": 3,
//         "priority": 80,
//         "expiryDate": null,
//         "preferredZone": "B"
//       }
//     ],
//     "containers": [
//       {
//         "containerId": "container1",
//         "zone": "A",
//         "width": 10,
//         "depth": 10,
//         "height": 10
//       },
//       {
//         "containerId": "container2",
//         "zone": "B",
//         "width": 8,
//         "depth": 8,
//         "height": 8
//       }
//     ]
//   }
  

// Example Response body:
// {
//   "success": true,
//   "placements": [
//     {
//       "itemId": "item1",
//       "containerId": "container1",
//       "position": {
//         "startCoordinates": { "width": 0, "depth": 0, "height": 0 },
//         "endCoordinates": { "width": 5, "depth": 5, "height": 5 }
//       }
//     },
//     {
//       "itemId": "item2",
//       "containerId": "container2",
//       "position": {
//         "startCoordinates": { "width": 0, "depth": 0, "height": 0 },
//         "endCoordinates": { "width": 3, "depth": 3, "height": 3 }
//       }
//     }
//   ],
//   "rearrangements": [],
//   "unplacedItems": [],
//   "utilization": [
//     {
//       "containerId": "container1",
//       "zone": "A",
//       "totalVolume": 1000,
//       "usedVolume": 125,
//       "availableVolume": 875,
//       "utilizationPercentage": 12.5
//     },
//     {
//       "containerId": "container2",
//       ...
