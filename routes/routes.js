var express = require('express');
var router = express.Router();
var azures = require('./azure');
var twitter_client = require('./twitterSetup');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/analyse', function (req, res, next) {
    azures();
  //twitter_client();
});

module.exports = router;
