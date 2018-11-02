var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');

var home = require('./routes/HomeController');
var users = require('./routes/UserController');
var db = require('./routes/DataBaseController');
var error = require('./routes/ErrorController');
var acc = require('./routes/ACCController');

var app = express();

app.use(cors());
app.use(session({secret: 'ssshhhhh', saveUninitialized: true, resave: true}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /publicvzcvzv
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', home);
app.use('/Home', home);
app.use('/Users', users);
app.use('/DB', db);
app.use('/Error', error);
app.use('/ACC', acc);
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

module.exports = app;
app.listen(process.env.PORT || 3000);