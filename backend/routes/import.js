let express = require('express');
let router = express.Router();

/* POST retrieve item from container. */
router.post('/items', function (req, res, next) {
    res.send('respond with a post resource');
    next();
});
router.post('/containers', function (req, res, next) {
    res.send('respond with a post resource');
    next();
});
router.get('/arrangement', function (req, res, next) {
    res.send('respond with a post resource');
    next();
});

module.exports = router;
