//setup mongoose database
require( './db' );


var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var engine = require('ejs-locals');
var routes = require('./routes');



var port = process.env.PORT || 3000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//In order to use the layout
app.engine('ejs', engine);
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use( routes.current_user );
app.get('/', routes.index);
app.post('/create', routes.create);
app.get('/destory/:id', routes.destory);
app.get('/edit/:id', routes.edit);
app.post('/update/:id', routes.update);
app.get('/completed/:id', routes.completed);
app.get('/checktodo/:id', routes.checktodo);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
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
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var server = app.listen(port, function () {
  var host = server.address().address
  console.log('Example server listening at http://%s:%s', host, port)
})

//Another way to monitor
// var http = require( 'http' );
// app.set('port', process.env.PORT || 3001);
// http.createServer( app ).listen( app.get( 'port' ), function (){
//   console.log( 'Express server listening on port ' + app.get( 'port' ));
// });