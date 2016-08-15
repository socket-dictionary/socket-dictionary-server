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
                var wordList = [];
                if (!error && response.statusCode == 200) {
                    var body = JSON.parse(body);
                    body.quizlist.forEach(quiz => {
                        quiz.option.forEach(word => {
                            wordList.push(word)
                        })
                    });
                    resolve(wordList[Math.floor(Math.random() * wordList.length)]);
                }
            }
            request(options, callback);
        })
    },
    getDefinition: word => {
        return new Promise((resolve, reject) => {
            var options = {
                url: `https://twinword-word-graph-dictionary.p.mashape.com/definition/?entry=${word}`,
                headers: {
                    "X-Mashape-Key": process.env.MASHAPE_KEY
                }
            };

            function callback(error, response, body) {
                if (!error && response.statusCode == 200) {
                    var definition = JSON.parse(body);
                    var keys = Object.keys(definition.meaning)
                    keys.forEach(key => {
                        if (definition.meaning[key] != '') {
                            var meaning = definition.meaning[key]
                            var obj = {
                                word,
                                meaning
                            }
                            resolve(obj);
                        }
                    })
                }
            }
            request(options, callback);
        })
    }
}
