var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var session = require('express-session');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var twitter_client = require('./routes/twitterSetup');
var data_analysis = require('./routes/dataAnalysis');

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);
var routes = require('./routes/routes');
var configDB = require('./routes/models/database.js');

mongoose.Promise = global.Promise;
mongoose.connect(configDB.url, function (err, result) {
  if(err) throw err;
});

io.sockets.on('connection', function (socket) {
  twitter_client(socket);
  socket.on('disconnect', function () {
    socket.disconnect();
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', '/images/twitter.ico')));
app.use(function(req, res, next){
  res.io = io;
  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret:'secret_word-goes_here',
  resave: false,
  cookie: false
}));

app.use('/', routes);
app.use('/public', express.static(__dirname + '/public'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = {app: app, server: server};
