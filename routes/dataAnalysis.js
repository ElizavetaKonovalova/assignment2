var retext = require('retext');
var sentiment = require('retext-sentiment');
var cliche = require('retext-cliches');
var equality = require('retext-equality');
var profanity = require('retext-profanities');
var json = require('json-query');

module.exports = function (data, response) {
    retext().use(sentiment).use(function () {
        return function (cst) {
            response.io.emit('received data', cst.data);
        };
    }).process(data);

    // retext().use(cliche).use(profanity).use(equality).process(data, function (err, file) {
    //     if ((json('messages.message', {data: file}).value).length != 0)
    //         console.error(json('messages.message', {data: file}).value);
    // });
};


