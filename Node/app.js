var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cartRouter = require('./routes/cart');
var wishlistRouter = require('./routes/wishlist');
var orderRouter = require('./routes/order');
var accessRouter = require('./routes/accessrequest');

const cors = require("cors");
const mongoose = require("mongoose");

const dns = require("dns")
dns.setServers(["1.1.1.1", "8.8.8.8"])

require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected! & Port on 3000.."))
  .catch(err => console.log("❌ Error:", err));

var app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://crest-and-coller.vercel.app',
  'https://shirt-admin-panel.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS'));
    }
  },
  credentials: true
}));

app.get('/', (req, res) => {
  res.send('Shirt Website Backend is Live and Running!');
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/images/productimages', express.static(path.join(__dirname, 'public/images/productimages')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/cart', cartRouter);
app.use('/wishlist', wishlistRouter);
app.use('/order', orderRouter);
app.use('/accessrequest', accessRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
