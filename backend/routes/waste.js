let express = require('express');
let router = express.Router();

/* POST retrieve item from container. */
router.get('/identify', function (req, res, next) {
    res.send('respond with a resource');
    next();
});
router.post('/return-plan', function (req, res, next) {
    res.send('respond with a post resource');
    next();
});
router.post('/complete-undocking', function (req, res, next) {
    res.send('respond with a post resource');
    next();
});

module.exports = router;
