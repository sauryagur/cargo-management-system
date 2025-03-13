let express = require('express');
let router = express.Router();

/* POST /api/placement */
router.get('/', function (req, res, next) {
    res.json(["placement"]);
    next();
});

// Request Body:
// {
//     "items"
// :
//     [
//         {
//             "itemId": "string",
//             "name": "string",
//             "width": number,
//             "depth": number,
//             "height": number,
//             "priority": number,
//             "expiryDate": "string",// ISO format
//             "usageLimit": number,
//             "preferredZone": "string"// Zone
//         }
//     ],
//         "containers"
// :
//     [
//         {
//             "containerId": "string",
//             "zone": "string",
//             "width": number,
//             "depth": number,
//             "height": number
//         }
//     ]
// }

module.exports = router;

// Response body:
// {
//     "success"
// :
//     boolean,
//         "placements"
// :
//     [
//         {
//             "itemId": "string",
//             "containerId": "string",
//             "position": {
//                 "startCoordinates": {
//                     "width": number,
//                     "depth": number,
//                     "height": number
//                 },
//                 "endCoordinates": {
//                     "width": number,
//                     "depth": number,
//                     "height": number
//                 }
//             }
//         }
//     ],
//         "rearrangements"
// :
//     [
//         {
//             "step": number,
//             "action": "string",// "move", "remove","place"
//             "itemId": "string",
//             "fromContainer": "string",
//             "fromPosition": {
//                 "startCoordinates": {
//                     "width": number,
//                     "depth": number,
//                     "height": number
//                 },
//                 "endCoordinates": {
//                     "width": number,
//                     "depth": number,
//                     "height": number
//                 }
//             },
//             "toContainer": "string",
//             "toPosition": {
//                 "startCoordinates": {
//                     "width": number,
//                     "depth": number,
//                     "height": number
//                 },
//                 "endCoordinates": {
//                     "width": number,
//                     "depth": number,
//                     "height": number
//                 }
//             }
//         }
//     ],
// }