var express = require('express');
var router = express.Router();

var data = require('../models/data.js')
var Post = data.model('Post')
var User = data.model('User')
var Setting = data.model('Setting')

//Add settings objects to all entry point of this rooter
router.use((req, res, next) => {

    /*** Inserting global site datas ***/
    data.settings.find({}, (err, settings) => {

        settingsMapped = {}
        var settingsMapped = settings.reduce((obj, item) =>{
            obj[item.name] = item.value
            return obj
        }, {})

        res.locals.settings = settingsMapped

        data.menus.find({}).sort({ order: 1 }).exec((err, menus) => {
            res.locals.menus = menus

            data.users.findOne({ _id: req.session.userId }, (err, user) => {
                res.locals.user = user

                next();
            })
        })
    })

})

/*** Index ***/
router.get('/', function (req, res) {

    data.posts.findOne({ postType: "post" }).sort({ createdAt: -1 }).exec((err, mainPost) => {
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

    Post.getPosts({ status: "publish" }, (err, posts) => {
        res.render('posts', { posts: posts })
    })

})

/*** category ***/
router.get('/categories/:category', (req, res) => {

    var category = req.params.category

    Post.getPosts({ category: category, status: "publish" }, (err, posts) => {
        res.render('posts', { posts: posts })
    })

})

/*** Post ***/
router.get('/posts/:postId', (req, res, next) => {

    var postId = req.params.postId

    Post.getPost(postId, (err, post) => {
        if (post)
            data.comments.find({ postId: postId }, (err, comments) => {
                res.render('post', { post: post, comments: comments })
            })
        else next()
    })

})

router.get('/posts/:postName', (req, res) => {

    var postName = req.params.postName

    data.posts.findOne({ name: postName }, (err, post) => {
        if (post) {
            data.comments.find({ postId: post._id }, (err, comments) => {
                res.render('post', { post, comments })
            })
        }
        else {
            res.send("No posts for found name " + postName)
        }

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