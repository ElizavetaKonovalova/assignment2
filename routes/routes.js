var express = require('express');
var router = express.Router();
var azures = require('./azure');
var twitter_client = require('./twitterSetup');

router.get('/', function(req, res, next) {
	res.render('index');

	res.io.on('connection', function(socket){
		console.log("a user connected :" + socket.id);

		socket.on('disconnect', function(){
			console.log('user disconnected');
		});

		socket.on('search', function (query) {
			twitter_client(res, query);
		});
	});
});

module.exports = router;