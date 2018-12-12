var express = require('express');
var router = express.Router();

var data = require('../models/data.js')
var Post = data.model('Post')
var User = data.model('User')

router.get('/', function (req, res) {

    User.getUser(req.session.userId, (doc) => {
        var user = doc

        res.render('index', { user: user })

    })

})

module.exports = router;