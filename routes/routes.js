var express = require('express');
var router = express.Router();
var azures = require('./azure');
var twitter_client = require('./twitterSetup');

router.get('/', function(req, res, next) {
	twitter_client(res);
	res.render('index');
});

module.exports = router;