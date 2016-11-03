var configAuth = require('./models/credentials');
var twitter = require('twitter');
var data_analysis = require('./dataAnalysis');
var SearchHistory = require('./models/history');
var obj_id = require('mongoose').ObjectId;

module.exports = function (socket) {

    var client = new twitter({
        consumer_key: configAuth.twitter.consumer_key,
        consumer_secret: configAuth.twitter.consumer_secret,
        access_token_key: configAuth.twitter.access_token,
        access_token_secret: configAuth.twitter.access_token_secret
    });

    var current_stream;

    socket.on('disconnect', function(){
        socket.disconnect();
        current_stream.destroy();
    });

    socket.on('search', function (query) {

        if(current_stream)
            current_stream.destroy();

        current_stream = client.stream('statuses/filter.json', {track: query});

        current_stream.on('data', function (event) {
            data_analysis(event.text, socket);
        });

        current_stream.on('error', function(error) {
            throw error;
        });
    });

    socket.on('stopit', function () {
        current_stream.destroy();
    });

    socket.on('pass to db', function (sentiment, keywords, cliches, search_key) {

        SearchHistory.findOne({'twitter_search_schema.search_key': JSON.stringify(search_key)}, function done(err, found) {
            if (err) throw err;

            if(found) {
                found.twitter_search_schema.sentiment = JSON.stringify(sentiment);
                found.twitter_search_schema.keywords = JSON.stringify(keywords);
                found.twitter_search_schema.cliche = JSON.stringify(cliches);
                found.save(function (err) {
                    if(err) throw err;
                    return done(null, found);
                });
            }
            else {
                var new_search_history = new SearchHistory();
                new_search_history.twitter_search_schema.search_key = JSON.stringify(search_key);
                new_search_history.twitter_search_schema.cliche = JSON.stringify(cliches);
                new_search_history.twitter_search_schema.sentiment = JSON.stringify(sentiment);
                new_search_history.twitter_search_schema.keywords = JSON.stringify(keywords);
                new_search_history.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, new_search_history);
                });
            }
        });
    });

};

