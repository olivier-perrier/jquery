var express = require('express');
var router = express.Router();

var data = require('../models/data.js')
var Post = data.model('Post')
var User = data.model('User')
var Setting = data.model('Setting')

router.get('/', function (req, res) {

    User.getUser(req.session.userId, (doc) => {
        var user = doc

        data.settings.findOne({ name: "menu" }, (err, menu) => {

            res.render('index', { user: user, menu: menu.value })

        })

    })

})

router.get('/posts', (req, res) => {
    console.log("GET /posts")

    User.getUser(req.session.userId, (doc) => {
        var user = doc

        data.posts.find({}, (err, docs) => {
            data.settings.findOne({ name: "menu" }, (err, menu) => {

                res.render('posts', { posts: docs, user: user, menu: menu.value })
            })
        })

    })

})

// Requests for dynamique menu
data.settings.findOne({ name: "menu" }, (err, menuSetting) => {

    if (menuSetting) {

        menuSetting.value.forEach(menu => {

            router.get('/' + menu.name, function (req, res) {
                console.log("GET /" + menu.name)

                User.getUser(req.session.userId, (user) => {

                    res.render('page', { user: user, menu: menuSetting.value })

                })
            })

        })
    }
})

module.exports = router;