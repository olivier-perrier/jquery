var express = require('express');
var router = express.Router();

var data = require('../models/data.js')

var Resource = data.model.Resource

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

        if (doc.quantity < doc.cost * doc.level) {
          res.send({ message: "forbidden : not enouth resources" })
        } else {

          doc.level++
          doc.quantity -= doc.cost

          // data.resources.update({ userId: userId }, { $inc: { level: 1, quantity: -doc.cost } }, (err, num) => {
          data.resources.update({ userId: userId }, doc, (err, num) => {
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

    data.resources.findOne({ userId: userId }, (err, doc) => {

      if (doc == null) {
        res.send({ message: "not found : no resource found for user " + userId })

      } else {
        // Look for informations about the resource to update
        var secondsElapsed = (new Date() - doc.updatedAt) / 1000
        doc.updatedAt = new Date()
        doc.quantity += (doc.production * secondsElapsed)

        doc.production = Resource.production * doc.level
        doc.cost = Resource.cost * doc.level

        // Update the resoucr with new quantity
        data.resources.update({ userId: userId }, doc)
        // data.resources.update({ userId: userId }, { $set: { quantity: doc.quantity, updatedAt: new Date() } })

        res.send(doc)

      }
    })
  }
})

module.exports = router;