var express = require('express');
var router = express.Router();


router.get('/header.html', function (req, res) {
    res.render('header', {name: "olivier"})
})

router.get('/', function (req, res) {
    res.send('index')
})

module.exports = router;