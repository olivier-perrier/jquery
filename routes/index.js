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

    /*** Inserting global site datas ***/
    Setting.getAllSettings((err, settings) => {
        res.locals.settings = settings

        Post.getMenus((err, menus) => {

            menus.map(menu => {
                if (menu.format == "direct")
                    menu.link = "http://" + menu.content
                else if (menu.format == "categories")
                    menu.link = "/categories/" + menu.content
                else if (menu.format == "posts")
                    menu.link = "/posts/" + menu.content
                else if (menu.format == "pages")
                    menu.link = "/pages/" + menu.content
            })

            // Map the sub menus
            menus.map(menuParent => {

                var menuChildren = menus.filter(menuChild => menuParent._id == menuChild.parentId)

                if(menuChildren){
                    menuParent.menuChildren = menuChildren
                }
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

    data.posts.findOne({ postType: "post" }).sort({ createdAt: -1 }).exec((err, mainPost) => {
        console.log(mainPost)
        data.posts.find({ postType: "post" }).limit(2).exec((err, posts) => {

            res.render('index', { mainPost: mainPost, posts: posts })

        })

    })

})

/*** Direct ***/
router.get('/login', (req, res) => {

    res.render('login', {})

})

router.get('/signup', (req, res) => {

    res.render('signup')

})

/*** Posts ***/
router.get('/posts', (req, res) => {

    Post.getPosts({}, (err, posts) => {
        res.render('posts', { posts: posts })
    })

})

/*** category ***/
router.get('/categories/:category', (req, res) => {

    var category = req.params.category

    Post.getPosts({ category: category }, (err, posts) => {
        res.render('posts', { posts: posts })
    })

})

/*** Post ***/
router.get('/posts/:postId', (req, res, next) => {

    var postId = req.params.postId

    Post.getPost(postId, (err, post) => {
        if (post)
            Comment.getByPost(postId, (err, comments) => {
                res.render('post', { post: post, comments: comments })
            })
        else next()
    })

})

router.get('/posts/:postName', (req, res) => {

    var postName = req.params.postName

    Post.getPostByName(postName, (err, post) => {
        Comment.getByPost(post._id, (err, comments) => {
            res.render('post', { post, comments })
        })

    })

})

/*** Page ***/
router.get('/pages/:pagetId', (req, res, next) => {
    var pagetId = req.params.pagetId

    data.posts.findOne({ _id: pagetId }, (err, page) => {
        if (page)
            res.render('page', { page: page })
        else
            next()
    })

})

router.get('/pages/:pagetName', (req, res) => {

    var pagetName = req.params.pagetName

    data.posts.findOne({ name: pagetName }, (err, page) => {
        res.render('page', { page: page })
    })

})

/*** Users ***/
router.get('/users/account', (req, res) => {

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

    var query = req.params.query

    data.posts.find({ $or: [{ title: new RegExp(query, 'i') }, { content: new RegExp(query, 'i') }] }, (err, posts) => {
        console.log(posts)
        res.render('posts', { posts: posts })
    })

})

module.exports = router;