var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// var session = require('express-session')
// var flash = require('connect-flash');
// var fileupload = require('express-fileupload');



const developmentDB = {
  user: 'postgres',
  host: 'localhost',
  database: 'tes-amanah',
  
  password: 'aldi',
  port: 5432,
}

const isDevelopment = true
const { Pool } = require('pg')
let pool = null
if (isDevelopment) {
  pool = new Pool(developmentDB)
} else {
  console.log('not connected')
}

var indexRouter = require('./routes/index')(pool);



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
