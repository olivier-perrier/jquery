var express = require('express');
var router = express.Router();

var data = require('../models/data.js')
var User = data.model('User')

router.post('/login', (req, res) => {
  console.log("GET /API/users/login")

  var username = req.body.name
  var password = req.body.password

  data.users.findOne({ username: username, password: password }, (err, user) => {
    if (user) {
      req.session.userId = user._id
      res.send({ message: "success : loggin ", user: user })
    } else {
      res.send({ message: "not found : unknow username or password" })
    }
  })

})

router.post('/logout', (req, res) => {
  console.log("GET /API/users/logout")

  req.session.userId = null

  res.redirect('/')

})

router.post('/signup', (req, res) => {
  console.log("POST /user/signup")
  var userName = req.body.name

  data.users.findOne({ name: userName }, (err, doc) => {

    if (doc) {
      res.send({ message: "forbidden : user not available" })

    } else {
      //Create the user
      var newUser = User.returnUser(userName)

      data.users.insert(newUser, (err, docUser) => {
        console.log(docUser)
        var userId = docUser._id

        res.send({ message: "sigup success", user: docUser })

      })
    }
  })

})

module.exports = router;