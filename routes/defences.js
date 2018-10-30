var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
  res.send('Birds home page');
});

router.get('/about', function(req, res) {
  res.send('About birds');
});


router.get('/update', function(req, res) {
  res.send({message : "TODO : defences update"});
});

module.exports = router;