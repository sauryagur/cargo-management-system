let express = require('express');
let router = express.Router();

/* POST retrieve item from container. */
router.post('/day', function (req, res, next) {
    res.send('respond with a post resource');
    next();
});

module.exports = router;
