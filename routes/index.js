var express = require('express');
var router = express.Router();

var data = require('../models/data.js')
var Post = data.model('Post')
var User = data.model('User')
var Setting = data.model('Setting')

router.get('/', function (req, res) {

    User.getUser(req.session.userId, (user) => {
        data.posts.find({}, (err, posts) => {
            data.settings.findOne({ name: "menu" }, (err, menu) => {

                res.render('index', { posts: posts, user: user, menu: menu.value })

            })
        })

    })

})

router.get('/posts', (req, res) => {
    console.log("GET /posts")

    User.getUser(req.session.userId, (doc) => {
        var user = doc

        data.posts.find({}, (err, posts) => {
            data.settings.findOne({ name: "menu" }, (err, menu) => {

                res.render('posts', { posts: posts, user: user, menu: menu.value })
            })
        })

    })

})

router.get('/:page', function (req, res, next) {
    console.log("GET /:page")

    var pageName = req.params.page

    if (pageName == 'admin')
        next()
    else {


        console.log("page name = " + pageName)

        data.settings.findOne({ name: "menu" }, (err, setting) => {
            if (setting) {
                var menu = setting.value

                var menuPage = menu.find((elem) => {
                    return elem.name == pageName
                })

                //Page is a dynamique menu from setting
                if (menuPage) {
                    console.log("page found")
                    User.getUser(req.session.userId, (user) => {


                        res.render('page', { user: user, menu: menu })

                    })

                } else {
                    next()
                }


            } else {
                res.sendDate({ message: "internal error: impossible to find menu from setting" })
            }
        })
    }
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