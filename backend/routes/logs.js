let express = require('express');
let router = express.Router();

/* POST retrieve item from container. */
router.get('/', function (req, res) {
    res.send('respond with a resource');
});

module.exports = router;
