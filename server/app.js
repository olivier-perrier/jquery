const data = require('./data.js')

var indexRouter = require('../routes/index');
var defencesRouter = require('../routes/defences.js')
var usersRouter = require('../routes/users.js')

var express = require('express')
var session = require('express-session')
var bodyParser = require('body-parser');
const app = express()

var Resource = require('./Resource.js')

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

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

// app.use('static', express.static(__dirname + '/public'))
app.use(express.static('public'))

app.use('/', indexRouter);
app.use('/defences', defencesRouter);
app.use('/users', usersRouter);

app.get('/', function (req, res) {
  res.send(__dirname + '/public/index.html')
})


app.post('/resource/upgrade', function (req, res) {
  console.log('POST /resource/upgrade')
  var userId = req.session.userId

  if (userId == null)
    res.send({ message: 'You must be logged' })

  else {
    data.resources.findOne({ userId: userId }, (err, doc) => {

      if (doc == null) {
        res.send({ message: "no resource found" })

      } else {
        var cost = doc.cost
        var quantity = doc.quantity
        var level = doc.level

        if (quantity < cost * level) {
          res.send({ message: "not enouth resources" })
        } else {
          data.resources.update({ userId: userId }, { $inc: { level: 1, quantity: -cost } }, (err, num) => {
            res.send({ message: "success upgrade" })
          })
        }
      }
    })
  }
})

app.get('/resource/update', function (req, res) {
  console.log('GET /update')

  var userId = req.session.userId

  if (userId == null) {
    res.send({ message: "must be loggin" })

  } else {

    data.resources.findOne({ userId: userId }, (err, doc) => {

      if (doc == null) {
        res.send({ message: "no resource found" })

      } else {
        // Look for informations about the resource to update
        var newResource = new Resource(doc.level)
        newResource.updatedAt = doc.updatedAt
        newResource.quantity = doc.quantity
        newResource.userId = doc.userId
        newResource.update()

        // Update the resoucr with new quantity
        data.resources.update({ userId: userId }, newResource)

        res.send(newResource)

      }
    })
  }
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})