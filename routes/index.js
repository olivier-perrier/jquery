var express = require('express');
var router = express.Router();

var data = require('../models/data.js')
var Post = data.model('Post')
var User = data.model('User')
var Setting = data.model('Setting')

//Add settings objects to all entry point of this rooter
router.use((req, res, next) => {

    var widgets =
        [{ name: 'widgets/posts', data: { posts: [{ name: "post1" }, { name: "post2" }] } },
        { name: 'widgets/widget', value: "ok" }]


    res.locals.widgets = widgets


    Setting.getAllSettings((err, settings) => {
        res.locals.settings = settings
        next();
    })
})


router.get('/', function (req, res) {
    console.log("GET /")

    var widgets =
        [{ name: 'widgets/posts', data: { posts: [{ name: "post1" }, { name: "post2" }] } },
        { name: 'widgets/widget', value: "ok" }]

    User.getUser(req.session.userId, (user) => {
        Setting.getAllSettings((err, settings) => {

            data.posts.find({ postType: "post" }, (err, posts) => {

                data.posts.find({ postType: "menu" }, (err, menus) => {

                    res.render('index', { posts: posts, user: user, menus: menus, settings: settings })

                })
            })
        })

    })

})

router.get('/posts', (req, res) => {
    console.log("GET /posts")

    User.getUser(req.session.userId, (user) => {

        data.posts.find({ postType: "post" }, (err, posts) => {
            Post.getMenus((err, menus) => {

                res.render('posts', { posts: posts, user: user, menus: menus })
            })
        })

    })

})

router.get('/post/:postId', (req, res) => {
    console.log("GET /post/:postId")
    var postId = req.params.postId

    data.posts.findOne({ _id: postId }, (err, post) => {
        if (post == null) {
            res.send({ message: "not found : no posts found" })
        } else {
            data.posts.find({ postType: "menu" }, (err, menus) => {
                res.render('post', { post: post, menus: menus })
            })
        }
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

                Post.getPage(pageName, (err, page) => {

                    if (page) {

                        Post.getMenus((err, menus) => {

                            res.render('page', { page: page, user: "user", menus: menus })
                        })

                    } else {
                        res.send({ message: "internal error : no page found for name " + pageName })
                    }

                })

            } else if (menu.format == "posts") {

                var postCategory = menu.content


                Post.getPosts(postCategory, (err, posts) => {

                    Post.getMenus((err, menus) => {

                        res.render('posts', { posts: posts, user: "user", menus: menus })
                    })

                })

            } else if (menu.format == "post") {

                Post.getPost(pageName, (err, post) => {

                    if (post) {

                        console.log("redirection to " + "/posts/" + post._id)
                        res.redirect("/posts/" + post._id)

                    } else {
                        res.send({ message: "internal error : no post found for name " + pageName })
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