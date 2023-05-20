require("dotenv").config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const jwt = require('jsonwebtoken')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const signUpRouter = require('./routes/signUp')
const postsRouter = require('./routes/posts')
const authRouter = require('./routes/auth')
const newUserRouter = require('./routes/newUser')
var app = express();
const loginRouter = require('./routes/login')
const flash = require('express-flash')
const session = require('express-session')
const apiRouter = require('./routes/api')
// const session = require("express-session");

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(session({
  resave:true,
  saveUninitialized:true,
  secret: process.env.SECRET,
  cookie:{maxAge:3600000*24}
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/signUp', signUpRouter)
app.use('/posts', postsRouter)
app.use('/login', loginRouter)
app.use('/api', apiRouter)
app.use('/api/auth', authRouter)
app.use('/api/newUser', newUserRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log("error handler")
  console.log(err.stack)
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');

});

module.exports = app;
