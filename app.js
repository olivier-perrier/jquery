
var express = require('express')
var session = require('express-session')
var exphbs = require('express-handlebars')
var fileUpload = require('express-fileupload');

var indexRouter = require('./routes/index.js');
var adminRouter = require('./routes/admin.js')
var APIRouter = require('./routes/API.js')

var app = express()


var hbs = exphbs.create({
  defaultLayout: 'main.html',
  helpers: {
    toSimpleDate: function (date) { if(date) return date.toLocaleString() },
  }
})


app.engine('html', hbs.engine);
app.set('view engine', 'html');


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.use(fileUpload());

app.use(session({
  secret: 'srecetkeyop',
  resave: true,
  saveUninitialized: true,
}))

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/API', APIRouter);


app.listen(process.env.PORT || '3000', function () {
  console.log('Example app listening on port 3000!')
})

module.exports = app;