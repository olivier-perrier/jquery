
var express = require('express')
var session = require('express-session')
var exphbs = require('express-handlebars')
var fileUpload = require('express-fileupload');

var indexRouter = require('./routes/index.js');
var adminRouter = require('./routes/admin.js')
var APIRouter = require('./routes/API.js')

var authorizations = require('./components/authorizations')
var installation = require('./components/installation/installation')

var app = express()

var hbs = exphbs.create({
  defaultLayout: 'main.html',
  helpers: {
    toSimpleDate: function (date) { if (date) return date.toLocaleString() },
    toElapsedTime: function (date) {
      if (date) {
        if (Math.abs(new Date().getDay() - date.getDay()) > 0) return (7 + (new Date().getDay() - date.getDay())) % 7 + " days"
        if (new Date().getHours() - date.getHours() > 0) return new Date().getHours() - date.getHours() + " hours"
        if (new Date().getMinutes() - date.getMinutes() > 0) return new Date().getMinutes() - date.getMinutes() + " minutes"
        return new Date().getSeconds() - date.getSeconds() + " secondes"
      }
    },
    ifeq: function (var1, var2, options) {
      if (var1 == var2) return options.fn(this)
      else
        return options.inverse(this)
    }
  }
})

app.engine('html', hbs.engine);
app.set('view engine', 'html');


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: './tmp/'
}));

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

console.log("[DEBUG] NODE_ENV " + process.env.NODE_ENV)

installation.createModels()

app.all("*", authorizations.loadUser)
app.all("*", authorizations.requireAuthentication)

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/API', APIRouter);


app.listen(process.env.PORT || '3000', function () {
  console.log('Application listening on port 3000!')
})

module.exports = app;