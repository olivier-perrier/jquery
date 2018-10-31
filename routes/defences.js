var express = require('express');
var router = express.Router();

var data = require('../models/data.js')
var Defence = require('../models/Defence')


router.get('/', function (req, res) {
  res.send('Defences home page');
});

//Create a defence on the current user if no defence exist
router.post('/create', function (req, res) {
  console.log('GET /defences/create')
  var userId = req.session.userId

  if (userId == null)
    res.send({ message: 'forbiden : you must be logged' })

  else {
    data.defences.findOne({ userId: userId }, (err, doc) => {

      if (doc == null) {
        Defence.createDefence(userId)
        res.send({ message: "success : defence created" })
      } else {
        /*
          // Temporary force the creation of a new defence
          data.defences.remove({userId: userId})
          Defence.createDefence(userId) 
        */
        res.send({ message: "forbidden : defence already exist for the current user" })
      }
    })
  }

});

router.get('/update', function (req, res) {
  console.log('GET /defences/update')
  var userId = req.session.userId

  if (userId == null)
    res.send({ message: 'forbiden : you must be logged' })

  else {
    data.defences.findOne({ userId: userId }, (err, doc) => {

      if (doc == null)
        res.send({ message: "internal error : no defence found for user" })
      else
        res.send(doc)
    })
  }

});

module.exports = router;