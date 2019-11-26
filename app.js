var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');

require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var objectifsRouter = require('./routes/objectifs');
var businessRouter = require('./routes/business');
var meetingsRouter = require('./routes/meetings');
var directionsRouter = require('./routes/directions');
var servicesRouter = require('./routes/services');
var departementsRouter = require('./routes/departements');
var entitesRouter = require('./routes/entites');
var communRouter = require('./routes/commun');
var notificationsRouter = require('./routes/notifications');
var skillsRouter = require('./routes/skills');
var experiencesRouter = require('./routes/experiences');
var formationsRouter = require('./routes/formation');
var configRouter = require('./routes/config');

var authorize = require('./routes/authorize');

var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);


var cors = require('cors');
var bodyParser = require('body-parser')


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


//use socket io
app.use(function(req, res, next){
  // io.on("connection", socket => {
  //     console.log("New client connected");
  //     res.socket= socket
  //     socket.on("disconnect", () => {
  //       console.log("Client disconnected");
  //     });
      
  //   });
  res.io = io;
  next();
});

// app.use('/io', function(req, res){
//   io.on("connection", socket => {
//       console.log("New client connected");
//       socket.emit("test_resp", 201)
//       socket.on("disconnect", () => {
//         console.log("Client disconnected");
//       });
      
//     });
//     res.send("gii")
// });

//CORS

// Set up a whitelist and check against it:
var whitelist = ['http://example1.com', 'http://example2.com']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

// Then pass them to cors:
//app.use(cors(corsOptions));

app.use(cors());


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use(bodyParser.json())  
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', indexRouter);
app.use('/', communRouter);
app.use('/business', businessRouter);
app.use('/user', usersRouter);
app.use('/objectif', objectifsRouter);
app.use('/meeting', meetingsRouter);
app.use('/service', servicesRouter);
app.use('/direction', directionsRouter);
app.use('/departement', departementsRouter);
app.use('/entite', entitesRouter);
app.use('/notification', notificationsRouter);
app.use('/skills', skillsRouter);
app.use('/experiences', experiencesRouter);
app.use('/formation', formationsRouter);
app.use('/config', configRouter);



app.use('/authorize', authorize);



// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {app, server};
