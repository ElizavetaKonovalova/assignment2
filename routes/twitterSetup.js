var configAuth = require('./models/credentials');
var twitter = require('twitter');
var data_analysis = require('./dataAnalysis');
var SearchHistory = require('./models/history');
var MongooseObjectStream = require('mongoose-object-stream');
var modelStream = new MongooseObjectStream(SearchHistory);

module.exports = function (socket) {

    var client = new twitter({
        consumer_key: configAuth.twitter.consumer_key,
        consumer_secret: configAuth.twitter.consumer_secret,
        access_token_key: configAuth.twitter.access_token,
        access_token_secret: configAuth.twitter.access_token_secret
    });

    var current_stream;

    socket.on('search', function (query) {

        if(current_stream)
            current_stream.destroy();

        current_stream = client.stream('statuses/filter.json', {track: query});

        current_stream.on('data', function (data) {

            if(data != null || data != "")
            {
                //Put tweets into the DocumentDB database.
                modelStream.write({"search_key": query.toString(), "twitter_data": data.text.toString()});

                //Fetch data from the database.
                var cursor = SearchHistory.find({'search_key': query.toString()}).cursor();
                cursor.on('data', function(data) {
                        data_analysis(data.twitter_data, socket);
                });
            }
            else
                data_analysis("", socket);
        });

        current_stream.on('error', function(error) {
            console.log(error);
        });
    });

    socket.on('stopit', function (data) {
        current_stream.track = null;
        current_stream.destroy();
    });
};
