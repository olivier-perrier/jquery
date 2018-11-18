var express = require('express');
var router = express.Router();

var data = require('../models/data.js')
var Resource = data.model('Resource')

router.post('/upgrade', function (req, res) {
  console.log('POST /resources/upgrade')
  var userId = req.session.userId

  if (userId == null)
    res.send({ message: 'forbiden : you must be logged' })

  else {
    data.resources.findOne({ userId: userId }, (err, doc) => {

      if (doc == null) {
        res.send({ message: "internal error : resource not found for user" })

      } else {

        if (doc.quantity < doc.cost) {
          res.send({ message: "forbidden : not enouth resources" })
        } else {

          data.resources.update({ userId: userId }, { $inc: { level: 1, quantity: -doc.cost } }, (err, num) => {
            res.send({ message: "success : upgraded resource" })
          })
        }
      }
    })
  }
})

router.get('/update', function (req, res) {
  console.log('GET /resources/update')

  var userId = req.session.userId

  if (userId == null) {
    res.send({ message: 'forbiden : you must be logged' })

  } else {

    Resource.updateQuantity(userId)
    res.send(doc)

  }
})

module.exports = router;