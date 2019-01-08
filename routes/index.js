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

    console.log("page name : " + pageName)

    Post.getMenu(pageName, (err, menu) => {

        if (menu) {

            if (menu.format == "direct") {
                res.redirect("http://" + menu.content)

            } else if (menu.format == "page") {


            } else if (menu.format == "posts") {


            } else if (menu.format == "post") {

                Post.getPost(pageName, (err, post) => {

                    if (post) {

                        console.log("redirection to " + "/posts/" + post._id)
                        res.redirect("/posts/" + post._id)

                    }else{
                        res.send({message: "Internal error : no post found for name " + pageName})
                    }

                })
            }
       
        } else {
            console.log("No menu found for this page")
            next()
        }
    })
})

module.exports = router;