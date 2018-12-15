var express = require('express');
var router = express.Router();

var data = require('../models/data.js')
var Defence = data.model('Defence')
var Resource = data.model('Resource')

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
        var newDefence = new Defence(userId)
        data.defences.insert(newDefence, (err, doc) => {
          res.send({ message: "success : defence created" })
        })
      } else {
        res.send({ message: "forbidden : defence already exist for the current user" })
      }
    })
  }

});

router.post('/build', function (req, res) {
  console.log('GET /defences/build')

  var userId = req.session.userId
  var numberToBuild = req.body.numberToBuild

  Resource.update(userId)

  if (userId == null)
    res.send({ message: 'forbiden : you must be logged' })

  else {
    data.defences.findOne({ userId: userId }, (err, docDef) => {

      if (docDef == null) {
        res.send({ message: "internal error : no defence found for user" })
      } else {

        var totalPrice = docDef.price * numberToBuild

        data.resources.findOne({ userId: userId }, (err, docRes) => {

          if (docRes == null) {
            res.send({ message: "internal error : no resource found for user" })
          } else {

            if (docRes.quantity >= totalPrice) {

              // Remove price resourses
              data.resources.update({ userId: userId }, { $inc: { quantity: -totalPrice } }, (err, num) => { })

              // Increase defences number
              data.defences.update({ userId: userId }, { $inc: { number: numberToBuild } }, (err, num) => { })

              res.send({ message: "success : defences created" })

            } else {
              res.send({ message: "forbidden : no not enouth ressources" })

            }
          }
        })

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