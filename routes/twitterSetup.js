var configAuth = require('./models/credentials');
var twitter = require('twitter');
var data_analysis = require('./dataAnalysis');

module.exports = function (response, query) {

    var client = new twitter({
        consumer_key: configAuth.twitter.consumer_key,
        consumer_secret: configAuth.twitter.consumer_secret,
        access_token_key: configAuth.twitter.access_token,
        access_token_secret: configAuth.twitter.access_token_secret
    });

    var stream = client.stream('statuses/filter.json', {track: query});

    stream.on('data', function (event) {
        data_analysis(event.text, response);
    });

    stream.on('error', function(error) {
        throw error;
    });
};

