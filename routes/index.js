var express = require('express');
var router = express.Router();

var data = require('../models/data.js')
var Post = data.model('Post')
var User = data.model('User')
var Setting = data.model('Setting')

router.get('/', function (req, res) {

    User.getUser(req.session.userId, (user) => {

        data.posts.find({ postType: "post" }, (err, posts) => {

            data.posts.find({ postType: "menu" }, (err, menus) => {

                res.render('index', { posts: posts, user: user, menus: menus })

            })
        })

    })

})

router.get('/posts', (req, res) => {
    console.log("GET /posts")

    User.getUser(req.session.userId, (user) => {

        data.posts.find({ postType: "post" }, (err, posts) => {
            data.posts.find({ postType: "menu" }, (err, menus) => {

                res.render('posts', { posts: posts, user: user, menus: menus })
            })
        })

    })

})

router.get('/:page', function (req, res, next) {
    console.log("GET /:page")

    var pageName = req.params.page
    var postType = ""

    console.log("page name : " + pageName)

    data.posts.findOne({ postType: "menu", name: pageName }, (err, menu) => {

        if (menu) {

            data.posts.find({ postType: "menu" }, (err, menus) => {

                User.getUser(req.session.userId, (user) => {

                    data.posts.find({ postType: pageName }, (err, posts) => {

                        res.render('page', { user: user, menus: menus, posts: posts })
                    })
                })

            })
        }else{
            next()
        }
    })
})

module.exports = router;