let express = require('express');
let router = express.Router();

/* GET users listing. */
router.post('/', function (req, res, next) {
    res.send('im stoned');
    next();
});

module.exports = router;
