var express = require('express')
var session = require('express-session')
var cors = require('cors')

var fileUpload = require('express-fileupload');

var indexRouter = require('./routes/index.js');
var adminRouter = require('./routes/admin.js')
var APIRouter = require('./routes/API.js')

var exphbs = require('./components/handlebars')
//var installation = require('./components/installation')

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
  secret: 'srecetkeyopopopop',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

app.use(cors({
  origin: 'http://localhost:8080',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
  credentials: true,
  optionsSuccessStatus: 200
}))

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:8080");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header("Access-Control-Allow-Credentials", "true");
  
//   next();
// }); 

console.log("[DEBUG] NODE_ENV " + process.env.NODE_ENV)

    
//installation.createModels()

app.use('/admin', adminRouter);
app.use('/API', APIRouter);

app.use('/', indexRouter);

app.listen(process.env.PORT || '3000', function () {
  console.log('Application listening on port 3000!')
})

module.exports = app;