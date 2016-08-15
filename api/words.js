var request = require("request");
require("dotenv").config();

module.exports = {
    getWord: function() {
        return new Promise((resolve, reject) => {
            var options = {
                url: "https://twinword-word-association-quiz.p.mashape.com/type1/?area=gre&level=10",
                headers: {
                    "X-Mashape-Key": process.env.MASHAPE_KEY
                }
            };
            function callback(error, response, body) {
                if (!error && response.statusCode == 200) {
                    resolve(JSON.parse(body));
                }
            }
            request(options, callback);
        })
    }
}
