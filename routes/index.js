var express = require('express');
var router = express.Router();
var api = require('../api/words');
var games = require('../app').allGames
/* GET users listing. */
router.get('/word', function(req, res, next) {
    api.getWord().then(word => {
        api.getDefinition(word).then(definition => {
            res.send(definition);
        })
    });
});



module.exports = router;
