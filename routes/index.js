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

    if (req.session.userId == null) {
        req.session.userId = "ON7eEA8H65dQVT8u"
    }

    /*** Inserting global site datas ***/
    Setting.getAllSettings((err, settings) => {
        res.locals.settings = settings

        Post.getMenus((err, menus) => {
            res.locals.menus = menus

            User.getUser(req.session.userId, (err, user) => {
                res.locals.user = user

                next();
            })
        })
    })

})


router.get('/', function (req, res) {
    console.log("GET /")

    data.posts.findOne({ postType: "post" }).sort({ createdAt: -1 }).exec((err, mainPost) => {
        data.posts.find({ postType: "post" }).limit(2).exec((err, posts) => {

            res.render('index', { mainPost: mainPost, posts: posts })

        })

    })

})

router.get('/posts', (req, res) => {
    console.log("GET /posts")

    Post.getPosts({}, (err, posts) => {
        res.render('posts', { posts: posts })
    })

})

router.get('/post/:postId', (req, res) => {
    console.log("GET /post/:postId")
    var postId = req.params.postId

    data.posts.findOne({ _id: postId }, (err, post) => {
        res.render('post', { post: post })
    })

})

router.get('/page/:pagetId', (req, res) => {
    console.log("GET /page/:pagetId")
    var pagetId = req.params.pagetId

    data.posts.findOne({ _id: pagetId }, (err, page) => {
        res.render('page', { page: page })
    })

})

router.get('/:page', function (req, res, next) {
    console.log("GET /:page")

    var menuName = req.params.page

    console.log("page name : " + menuName)

    Post.getMenu(menuName, (err, menu) => {

        if (menu) {

            if (menu.format == "direct") {
                res.redirect("http://" + menu.content)

            } else if (menu.format == "page") {

                var pageName = menu.content

                Post.getPage(pageName, (err, page) => {

                    if (page) {

                        res.render('page', { page: page })

                    } else {
                        res.send({ message: "internal error : no page found for name " + pageName })
                    }

                })

            } else if (menu.format == "posts") {

                var postCategory = menu.content

                Post.getPosts({ category: postCategory }, (err, posts) => {

                    res.render('posts', { posts: posts })

                })

            } else if (menu.format == "post") {

                var postName = menu.content

                Post.getPostByName(postName, (err, post) => {

                    if (post) {

                        console.log("redirection to " + "/posts/" + post._id)
                        res.redirect("/post/" + post._id)

                    } else {
                        res.send({ message: "internal error : no post found for name " + pageName })
                    }

                })
            }

        } else {
            console.log("No menu found for this menu " + menuName)
            next()
        }
    })
})

module.exports = router;