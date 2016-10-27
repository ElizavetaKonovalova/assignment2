var express = require('express');
var router = express.Router();
var azures = require('./azure');
var twitter_client = require('./twitterSetup');

module.exports = function(io) {
    

    router.get('/', function(req, res, next) {	
		res.render('index', { title: 'Express' });
	});

    io.on('connection', function(socket) { 
        console.log("A user connected :" + socket.id);

        socket.on('disconnect', function(){
			console.log('user disconnected');
		});

		socket.on('search', function(query){
			console.log("User : " + socket.id + " Query : " + query);
			twitter_client(io, socket.id, query);
		});

    });

    return router;
}