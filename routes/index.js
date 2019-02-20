var express = require('express');
var router = express.Router();

var data = require('../models/data.js')
var Post = data.model('Post')
var User = data.model('User')
var Comment = data.model('Comment')
var Setting = data.model('Setting')

//Add settings objects to all entry point of this rooter
router.use((req, res, next) => {

    var widgets =
        [{ name: 'widgets/posts', data: { posts: [{ name: "post1" }, { name: "post2" }] } },
        { name: 'widgets/widget', value: "ok" }]

    res.locals.widgets = widgets

    // DEBUG USER AUTO LOGGIN
    if (process.env.NODE_ENV == 'dev') {
        if (!req.session.userId) {
            User.getByName("Olivier", (err, user) => {
                // console.log("[DEBUG] set default login")
                // req.session.userId = user._id
            })
        }
    }

    /*** Inserting global site datas ***/
    Setting.getAllSettings((err, settings) => {
        res.locals.settings = settings

        Post.getMenus((err, menus) => {

            menus.map(menu => {
                if (menu.format == "direct")
                    menu.link = menu.content
                else if (menu.format == "posts")
                    menu.link = "/category/" + menu.content
                else if (menu.format == "post")
                    menu.link = "/post/" + menu.content
                else if (menu.format == "page")
                    menu.link = "/page/" + menu.content
            })

            res.locals.menus = menus

            User.getUser(req.session.userId, (err, user) => {
                if (user)
                    user.accessAdmin = user.role == "admin" || user.role == "author"

                res.locals.user = user

                next();
            })
        })
    })

})

/*** Index ***/
router.get('/', function (req, res) {
    console.log("GET /")

    data.posts.findOne({ postType: "post" }).sort({ createdAt: -1 }).exec((err, mainPost) => {
        data.posts.find({ postType: "post" }).limit(2).exec((err, posts) => {

            res.render('index', { mainPost: mainPost, posts: posts })

        })

    })

})

/*** Posts ***/
router.get('/posts', (req, res) => {
    console.log("GET /posts")

    Post.getPosts({}, (err, posts) => {
        res.render('posts', { posts: posts })
    })

})

router.get('/posts/:category', (req, res) => {
    console.log("GET /posts/:category")

    var category = req.params.category

    Post.getPosts({ category: category }, (err, posts) => {
        res.render('posts', { posts: posts })
    })

})

/*** category ***/
router.get('/category/:category', (req, res) => {
    console.log("GET /category/:category")

    var category = req.params.category

    Post.getPosts({ category: category }, (err, posts) => {
        res.render('posts', { posts: posts })
    })

})

/*** Post ***/
router.get('/post/:postId', (req, res, next) => {
    console.log("GET /post/:postId")

    var postId = req.params.postId

    Post.getPost(postId, (err, post) => {
        if (post)
            Comment.getByPost(postId, (err, comments) => {
                res.render('post', { post: post, comments: comments })
            })
        else next()
    })

})

router.get('/post/:postName', (req, res) => {
    console.log("GET /post/:postName")

    var postName = req.params.postName

    Post.getPostByName(postName, (err, post) => {
        Comment.getByPost(post._id, (err, comments) => {
            res.render('post', { post: post, comments })
        })

    })

})

/*** Page ***/
router.get('/page/:pagetId', (req, res, next) => {
    console.log("GET /page/:pagetId")
    var pagetId = req.params.pagetId

    data.posts.findOne({ _id: pagetId }, (err, page) => {
        if (page)
            res.render('page', { page: page })
        else
            next()
    })

})

router.get('/page/:pagetName', (req, res) => {
    console.log("GET /page/:pagetName")

    var pagetName = req.params.pagetName

    data.posts.findOne({ name: pagetName }, (err, page) => {
        res.render('page', { page: page })
    })

})

/*** User ***/
router.get('/login', (req, res) => {
    console.log("GET /login")

    res.render('login', {})

})

router.get('/signup', (req, res) => {
    console.log("GET /signup")

    res.send("Signup not available yet")

})

router.get('/user/account', (req, res) => {
    console.log("GET /user/account")

    userId = req.session.userId

    data.users.findOne({ _id: userId }, (err, user) => {

        if (user == null) {
            res.send({ message: "forbidden: You must be logged" })
        } else {
            res.send("Account not available yet")
        }

    })

})

/*** Search ***/
router.get('/search/:query', (req, res) => {
    console.log("GET /search/:query")

    var query = req.params.query

    data.posts.find({ $or: [{ title: new RegExp(query, 'i') }, { content: new RegExp(query, 'i') }] }, (err, posts) => {
        console.log(posts)
        res.render('posts', { posts: posts })
    })

})

module.exports = router;