let express = require('express');
let router = express.Router();

/* GET users listing. */
router.post('/', function (req, res) {
    res.send('im stoned');
});

module.exports = router;
