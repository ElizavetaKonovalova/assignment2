var express = require('express');
var router = express.Router();
var azures = require('./azure');
// var twitter_client = require('./twitterSetup');

var configAuth = require('./models/credentials');
var twitter = require('twitter');
var data_analysis = require('./dataAnalysis');

module.exports = function(io) {

	router.get('/', function(req, res, next) {	
		res.render('index', { title: 'Express' });
	});

	var currentStream;

	io.on('connection', function(socket) { 
		var client = new twitter({
			consumer_key: configAuth.twitter.consumer_key,
			consumer_secret: configAuth.twitter.consumer_secret,
			access_token_key: configAuth.twitter.access_token,
			access_token_secret: configAuth.twitter.access_token_secret
		});

		console.log("A user connected :" + socket.id);

		socket.on('disconnect', function(){
			currentStream.destroy();
			console.log('user disconnected');
		});

		socket.on('search', function(query){
			if(currentStream){
				currentStream.destroy();
			}
			
			console.log("User : " + socket.id + " Query : " + query);


			client.stream('statuses/filter.json', {track: query}, function(stream){
				currentStream = stream;

				stream.on('data', function (event) {
			        // console.log(event.text);
			        var result = data_analysis(event.text);

			        //send data back to specific client
			        io.sockets.connected[socket.id].emit('received data', result);
			    });

				stream.on('error', function(error) {
			        throw error;
			    });

			});

			// twitter_client(io, socket.id, query);
		});

		socket.on('stop search', function(){
			currentStream.destroy();
		});

	});

	return router;
}