var express = require('express');
var router = express.Router();

var data = require('../models/data.js')
var User = data.model.User
var Resource = data.model.Resource
var Defence = data.model.Defence


router.post('/loggin', (req, res) => {
  console.log("POST /users/loggin")
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

router.post('/signup', (req, res) => {
  console.log("POST /users/signup")
  var userName = req.body.name

  data.users.findOne({ name: userName }, (err, doc) => {

    if (doc) {
      res.send({ message: "forbidden : user not available" })

    } else {
      //Create the user
      var newUser = new User(userName)

      data.users.insert(newUser, (err, docUser) => {
        console.log(docUser)
        var userId = docUser._id

        //Create the resource
        var newResource = new Resource(userId)
        data.resources.insert(newResource, (err, docResource) => {
          // console.log("success : resource created")
          // res.send({ message: "sigup success", user: docUser, resource: docResource })
        })

        //Create the defence
        var newDefence = new Defence(userId)
        data.defences.insert(newDefence, (err, doc) => {
          // console.log("success : defence created")
          // res.send({ message: "sigup success", user: docUser, resource: docResource })
        })

        res.send({ message: "sigup success", user: docUser })

      })
    }
  })

})

router.get('/account', (req, res) => {
  console.log("GET /users/account")

  userId = req.session.userId

  data.users.findOne({ _id: userId }, (err, user) => {

    if (user == null) {
      res.send({ message: "forbidden: You must be logged" })
    } else {
      res.send({ messagge: "success: Account informations", user: user })
    }

  })

})



module.exports = router;