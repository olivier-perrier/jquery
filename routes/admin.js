var express = require('express');
var router = express.Router();

var data = require('../models/data.js')

var authorizations = require('../components/authorizations')

router.all("*", (req, res, next) => {
  next()
})

// Authorizations
router.all("*", authorizations.requireAuthentication)

router.use((req, res, next) => {
  next()
})

/*** Generic routes ***/
//TODO faut il une route d'edition et une de visualisation en adminitrateur ?
router.get('/:model/edit/:postId', (req, res) => {
  var modelName = req.params.model
  var postId = req.params.postId

  res.send({ messsage: " TODO" })

})


module.exports = router;