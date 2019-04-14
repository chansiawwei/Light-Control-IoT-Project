var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mqtt = require('mqtt')

/* Global variable - evil */
roomTemperature = null

var indexRouter = require('./routes/index');
var tempRounter = require('./routes/sensorTemp');
var roomTempRouter = require('./routes/roomTemp');
var motorSwitchRouter = require('./routes/motorSwitch');

var app = express();

app.use(cors());

//MQTT handler
var client = mqtt.connect('mqtt://localhost')

client.on('connect', function(){
  client.subscribe('server/room/temp');
})

client.on('message', function(topic, message){
  console.log(topic.toString() + " " + message.toString())
  roomTemperature = Number(message.toString())
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/sensorTemp', tempRounter);
app.use('/roomTemp', roomTempRouter);
app.use('/motor', motorSwitchRouter);

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
