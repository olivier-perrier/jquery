var express = require('express');
var router = express.Router();

var data = require('../models/data.js')
var Post = data.model('Post')
var User = data.model('User')
var Setting = data.model('Setting')

router.get('/', function (req, res) {

    User.getUser(req.session.userId, (doc) => {
        var user = doc

        res.render('index', { user: user, menu: Setting.menu })

    })

})

router.get('/posts', (req, res) => {
    console.log("GET /posts")
  
    User.getUser(req.session.userId, (doc) => {
      var user = doc
  
      data.posts.find({}, (err, docs) => {
        if (docs == null) {
          res.send({ message: "not found : no posts found" })
        } else {
          res.render('posts', { posts: docs, user: user, menu: Setting.menu })
        }
      })
  
    })
  
  })

// Requests for dynamique menu
Setting.menu.forEach(menu => {

    router.get('/' + menu.name, function (req, res) {
        console.log("GET /" + menu.name)

        User.getUser(req.session.userId, (doc) => {
            var user = doc
            res.render('page', { user: user, menu: Setting.menu })
        })
    })

});

module.exports = router;