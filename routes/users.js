var express = require('express');
var router = express.Router();

var data = require('../models/data.js')

var User = require('../models/User')

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
          res.send({ message: "sigup success", user: docUser, resource: docResource })
        })

      })
    }
  })

})

router.get('/account', (req, res) => {
  console.log("GET /users/account")

  userId = req.session.userId

  // User.findById(userId).then((user) => { return res.send(user) })
  // user = new User()
  // User().then((data) => {
  //   console.log(data)
  // })
  // user.findById(userId).then((user) => {
  //   console.log(user)
  //   return res.send(user)
  // })

  if (userId == null)
    res.send({ message: "You must be logged" })
  else
    res.send({ messagge: "Account informations : success", userId: userId })
})



module.exports = router;