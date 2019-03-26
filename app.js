var express = require('express')
var session = require('express-session')

var fileUpload = require('express-fileupload');

var indexRouter = require('./routes/index.js');
var adminRouter = require('./routes/admin.js')
var APIRouter = require('./routes/API.js')

var exphbs = require('./components/handlebars')
var installation = require('./components/installation')

var app = express()

app.engine('hbs', exphbs.hbs.engine);
app.set('view engine', 'hbs');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: './public/medias/tmp/'
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

app.use('/admin', adminRouter);
app.use('/API', APIRouter);

app.use('/', indexRouter);

app.listen(process.env.PORT || '3000', function () {
  console.log('Application listening on port 3000!')
})

module.exports = app;