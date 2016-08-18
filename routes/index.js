var express = require('express');
var router = express.Router();
var api = require('../api/words');
var games = require('../app').allGames
    /* GET users listing. */

var count = 0;
router.get('/word', function(req, res, next) {
    api.getWord().then(word => {
        api.getDefinition(word).then(definition => {
            console.log("Current Count: ", count++);
            res.send(definition);
        })
    });
});



module.exports = router;
