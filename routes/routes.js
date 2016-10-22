var express = require('express');
var router = express.Router();
var twitter_client = require('./twitterSetup');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/cliches', function (req, res, next) {
  twitter_client("cliches");
});

router.get('/sentiment', function (req, res, next) {
  twitter_client("sentiment");
});

module.exports = router;
