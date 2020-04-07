var express = require('express')
var session = require('express-session')
var cors = require('cors')

var fileUpload = require('express-fileupload');

var indexRouter = require('./routes/index.js');
var adminRouter = require('./routes/admin.js')
var APIRouter = require('./routes/API.js')

var app = express()

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

console.log("[DEBUG] NODE_ENV " + process.env.NODE_ENV)

    
//installation.createModels()

app.use('/admin', adminRouter);
// app.use('/admin', adminRouter);
app.use('/API', APIRouter);

app.use('/', indexRouter);

app.listen(process.env.PORT || '3000', function () {
  console.log('Application listening on port 3000')
})

module.exports = app;