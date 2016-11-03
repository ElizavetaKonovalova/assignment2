var express = require('express');
var router = express.Router();
var azures = require('./azure');

router.get('/', function(req, res, next) {
	res.render('index');
});

module.exports = router;