var express = require('express');
var router = express.Router();

var data = require('../models/data.js')
var User = data.model('User')


router.post('/loggin', (req, res) => {
  console.log("GET /users/loggin")

  var userName = req.body.name

  data.users.findOne({ name: userName }, (err, user) => {
    if (user) {
      req.session.userId = user._id
      res.redirect("/")
      // res.send({ message: "success : loggin ", user: user })
    } else {
      res.send({ message: "not found : unknow username" })
    }
  })

})

router.get('/logout', (req, res) => {
  console.log("GET /users/logout")
  
  req.session.userId = null

  res.redirect('/')

})

router.post('/signup', (req, res) => {
  console.log("POST /users/signup")
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

router.get('/account', (req, res) => {
  console.log("GET /users/account")

  userId = req.session.userId

  data.users.findOne({ _id: userId }, (err, user) => {

    if (user == null) {
      res.send({ message: "forbidden: You must be logged" })
    } else {
      res.send("This is account")
    }

  })

})



module.exports = router;