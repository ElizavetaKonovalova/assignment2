var configAuth = require('./models/credentials');
var twitter = require('twitter');
var retext = require('retext');
var sentiment = require('retext-sentiment');
var cliche = require('retext-cliches');
var equality = require('retext-equality');
var report = require('vfile-reporter');
var profanity = require('retext-profanities');
var inspect = require('unist-util-inspect');
var json = require('json-query');

//Visualization
var d3 = require('d3');
var jsdom = require('jsdom');

module.exports = function (flag) {

    var client = new twitter({
        consumer_key: configAuth.twitter.consumer_key,
        consumer_secret: configAuth.twitter.consumer_secret,
        access_token_key: configAuth.twitter.access_token,
        access_token_secret: configAuth.twitter.access_token_secret
    });

    var stream = client.stream('statuses/filter.json', {track: "trump, war"});

    stream.on('data', function (event) {
        switch (flag){
            case "cliches":
                Cliches(event.text);
                break;
            case "sentiment":
                Sentiment(event.text);
                break;
            default:
                break;
        }
    });
};


//Data analysis section
function Sentiment(data) {
    retext().use(sentiment).use(function () {
        return function (cst) {
            //Visualisation(json('data', {data: cst}).value);
            console.log(json('data', {data: cst}).value);
        };
    }).process(data);
}

function Cliches(data) {
    retext()
        .use(cliche)
        .use(profanity)
        .use(equality)
        .process(data, function (err, file) {
            //console.log(String(file));
            if (file !== "no issues found")
                console.error(report(err || file));
        });
}

/*function Visualisation(data) {

    var document = jsdom.jsdom();
    var p = d3.select(document.body).selectAll("p")
        .data(data)
        .enter()
        .append("p")
        .text(function (d,i) {
            return "i = " + i + " d = "+d;
        });
}*/