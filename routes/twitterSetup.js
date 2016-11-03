var configAuth = require('./models/credentials');
var twitter = require('twitter');
var data_analysis = require('./dataAnalysis');

module.exports = function (response) {

    var client = new twitter({
        consumer_key: configAuth.twitter.consumer_key,
        consumer_secret: configAuth.twitter.consumer_secret,
        access_token_key: configAuth.twitter.access_token,
        access_token_secret: configAuth.twitter.access_token_secret
    });

    var current_stream;

    response.io.on('connection', function(socket){

        socket.on('search', function (query) {

            if(current_stream)
                current_stream.destroy();

            current_stream = client.stream('statuses/filter.json', {track: query});

            current_stream.on('data', function (event) {
                data_analysis(event.text, response);
            });

            current_stream.on('error', function(error) {
                throw error;
            });
        });

        socket.on('disconnect', function () {
            current_stream.destroy();
        });

        socket.on('stopit', function () {
            current_stream.destroy();
        });

        socket.on('pass to db', function () {

        });
    });
};

