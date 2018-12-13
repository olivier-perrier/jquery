var express = require('express');
var router = express.Router();

var data = require('../models/data.js')
var Post = data.model('Post')
var User = data.model('User')

var menus = [{name: "contracts"}, {name: "clients"}]


router.get('/', function (req, res) {

    User.getUser(req.session.userId, (doc) => {
        var user = doc

        res.render('index', { user: user, menus: menus })

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
          res.render('posts', { posts: docs, user: user, menus: menus })
        }
      })
  
    })
  
  })

// Requests for dynamique menus
menus.forEach(menu => {

    router.get('/' + menu.name, function (req, res) {
        console.log("GET /" + menu.name)

        User.getUser(req.session.userId, (doc) => {
            var user = doc
            res.render('page', { user: user, menus: menus })
        })
    })

});

module.exports = router;