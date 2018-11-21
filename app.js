
var express = require('express')
var session = require('express-session')
var mustacheExpress = require('mustache-express')

var indexRouter = require('./routes/index.js');
var usersRouter = require('./routes/users.js')
var defencesRouter = require('./routes/defences.js')
var resourcesRouter = require('./routes/resources.js')
var postsRouter = require('./routes/posts.js')

var app = express()


app.engine('html', mustacheExpress());
app.set('view engine', 'html');


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))

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
app.use('/users', usersRouter);
app.use('/defences', defencesRouter);
app.use('/resources', resourcesRouter);
app.use('/posts', postsRouter);


app.listen(process.env.PORT || '3000', function () {
  console.log('Example app listening on port 3000!')
})

module.exports = app;