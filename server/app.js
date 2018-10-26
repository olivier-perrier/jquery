const data = require('./data.js')

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
        newResource.update()

        var level = doc.level
        var production = doc.production
        var updatedAt = doc.updatedAt
        var quantity = doc.quantity
        var secondsElapsed = (new Date() - updatedAt) / 1000
        var newQuantity = quantity
        newQuantity += (production * level) * secondsElapsed

        // Update the resoucr with new quantity
        data.resources.update({ userId: userId }, { $set: { quantity: newQuantity, updatedAt: new Date() } })

        // Return the updated resource
        data.resources.findOne({ userId: userId }, (err, doc) => {
          res.json(doc)
        })
      }
    })
  }
})

app.post('/user/loggin', (req, res) => {
  console.log("POST /user/loggin")
  var userName = req.body.name

  data.users.findOne({ name: userName }, (err, doc) => {
    if (doc) {
      req.session.userId = doc._id
      res.send({ message: "success loggin", name: doc.name })
    } else {
      res.send({ message: "unknow username" })
    }
  })

})

app.post('/user/signup', (req, res) => {
  console.log("POST /user/signup")
  var userName = req.body.name

  data.users.findOne({ name: userName }, (err, doc) => {

    if (doc) {
      res.send({ message: "user not available" })

    } else {
      //Create the user
      var newUser = data.userModel
      newUser.name = userName
      data.users.insert(newUser, (err, docUser) => {
        var userId = docUser._id

        //Create the resource
        // var newResource = data.resourceModel
        var newResource = new Resource(1)
        newResource.userId = userId
        data.resources.insert(newResource, (err, docResource) => {
          res.send({ message: "success", user: docUser, resource: docResource })
        })

      })
    }
  })

})

app.get('/user/account', (req, res) => {
  console.log("GET /user/account")

  userId = req.session.userId

  if (userId == null)
    res.send({ message: "You must be logged" })
  else
    res.send({ messagge: "success", userId: userId })
})




app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})