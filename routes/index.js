var express = require('express');
var router = express.Router();
var api = require('../api/words');

/* GET users listing. */
router.get('/', function(req, res, next) {
    api.getWord().then(word => {
        res.send(word);
    });
});

module.exports = router;
