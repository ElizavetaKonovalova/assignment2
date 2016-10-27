var configAuth = require('./models/credentials');
var twitter = require('twitter');
var data_analysis = require('./dataAnalysis');

module.exports = function (io, socketid, query) {

    var client = new twitter({
        consumer_key: configAuth.twitter.consumer_key,
        consumer_secret: configAuth.twitter.consumer_secret,
        access_token_key: configAuth.twitter.access_token,
        access_token_secret: configAuth.twitter.access_token_secret
    });

    // var stream = client.stream('statuses/filter.json', {track: "trump, war"});
    var stream = client.stream('statuses/filter.json', {track: query});

    stream.on('data', function (event) {
        // console.log(event.text);
        var result = data_analysis(event.text);

        //send data back to specific client
        io.sockets.connected[socketid].emit('received data', result);
    });

    stream.on('error', function(error) {
        throw error;
    });
};

