let express = require('express');
let router = express.Router();

/* POST retrieve item from container. */
router.post('/', function (req, res, next) {
    res.send('respond with a resource');
    next();
});

module.exports = router;
