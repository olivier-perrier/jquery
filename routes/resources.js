var express = require('express');
var router = express.Router();

var data = require('../models/data.js')

var Resource = require('../models/Resource')

router.post('/upgrade', function (req, res) {
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

router.get('/update', function (req, res) {
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
        newResource.quantity = doc.quantity
        newResource.userId = doc.userId
        newResource.update()

        // Update the resoucr with new quantity
        data.resources.update({ userId: userId }, newResource)

        res.send(newResource)

      }
    })
  }
})

module.exports = router;