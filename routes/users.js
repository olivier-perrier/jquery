var express = require('express');
var router = express.Router();

const data = require('../server/data.js')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/loggin', (req, res) => {
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

router.post('/signup', (req, res) => {
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

router.get('/account', (req, res) => {
  console.log("GET /user/account")

  userId = req.session.userId

  if (userId == null)
    res.send({ message: "You must be logged" })
  else
    res.send({ messagge: "success", userId: userId })
})



module.exports = router;