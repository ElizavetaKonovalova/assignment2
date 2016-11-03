var retext = require('retext');
var sentiment = require('retext-sentiment');
var cliche = require('retext-cliches');
var equality = require('retext-equality');
var profanity = require('retext-profanities');
var json = require('json-query');
var keywords = require('retext-keywords');
var nlcstToString = require('nlcst-to-string');

module.exports = function (data, socket) {

    //Sentiment Analysis
    retext().use(sentiment).use(function () {
        return function (cst) {
            socket.emit('received data', cst.data);
        };
    }).process(data);

    //Cliche and profanity analysis
    retext().use(cliche).use(profanity).use(equality).process(data, function (err, file) {
        if ((json('messages.message', {data: file}).value).length != 0)
            socket.emit("cliche", json('messages.message', {data: file}).value);
    });

    //Keyword extraction
    retext().use(keywords).process(data, function (err, result) {
        result.data.keywords.forEach(function (keyword) {
            socket.emit("keywords", nlcstToString(keyword.matches[0].node).toString());
        });
    });
};



