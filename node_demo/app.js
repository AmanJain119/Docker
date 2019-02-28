//require connection file to connect mongo
require('./connection');

// =================================================================
// get the packages we need ========================================
// =================================================================
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//express validator for server side validation
var validator = require('express-validator');

//to help secure Express/Connect apps with various HTTP headers
var helmet = require('helmet');
var compression = require('compression');
var config = require('./config');

var app = express();
app.use(compression());
app.use(helmet());
app.use(helmet.noCache());
app.use(helmet.referrerPolicy({policy: 'same-origin'}));
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"]
    }
}));

global.secret = '@qwerty@secret';
app.set('env', config.env.name || 'development');

//require session module
var session = require('express-session');
//require swig module and view engine setup
var swig = require('swig');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', swig.renderFile);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(validator());

// middleware for init the passport module
app.use(session({secret: '_secret_session', resave: false, saveUninitialized: false}));  // session secret

app.use('/products', require('./routes/products'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Service Unavailable');
    err.status = 503;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        if (err.status !== 400)
            console.log(err.stack);
        res.send({message: err.message, status: 0});
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send({message: err.message, status: 0});
});

module.exports = app;
