var createError = require('http-errors');
var mongoose = require('mongoose');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var flash = require('connect-flash');
var authenticate = require('./routes/authenticate')(passport);
var usersRouter = require('./routes/users');
var cityName = require('./routes/cityName'); //getting city name from the database to list down the cities
var basicInfo = require('./routes/basicInfo');//saving the basic info of the user
var emailNotification = require('./routes/emailNotification'); // sending the email notification to the user
var userController = require('./routes/userController');//for the token
//connect the database
mongoose.connect('mongodb://localhost/FYP',{useNewUrlParser:true})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({  name: 'mycookie',token:"mytoken",secret:'my own secret',resave:false,saveUninitialized:false, cookie: { maxAge: false,
  sameSite: true,secure: false}}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('./models/db.js')

// passport initialize 

var inPassport = require('./views/passport');
inPassport(passport);

app.use('/auth', authenticate);
//app.use('/', usersRouter);
app.use('/cityName',cityName);//city dropdown list which is available in the 
app.use('/basicinfo',basicInfo);
app.use('/emailNotification',emailNotification);

app.use('/confirmation', userController.confirmationPost);
app.use('/resetPassword',userController.forgetPassword)
app.use('/',(req,res,next)=>{
 
res.sendFile(__dirname+'/public/index.html');
})
//app.post('/resend', userController.resendTokenPost);
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
