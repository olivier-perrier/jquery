var express = require('express');
var router = express.Router();

var data = require('../models/data.js')

var authorizations = require('../components/authorizations')

// Print route
router.all("*", (req, res, next) => {
    console.log("[DEBUG] " + req.method + " " + req.baseUrl + req.path)
    next()
})

// Loading user
router.all("*", authorizations.loadUser)

// Inserting Settings, menus, current user
router.use((req, res, next) => {

    // Insert settings
    data.settings.find({}, (err, settings) => {

        settingsMapped = {}
        var settingsMapped = settings.reduce((obj, item) => {
            obj[item.name] = item.value
            return obj
        }, {})

        res.locals.settings = settingsMapped

        // Insert menus
        data.menus.find({}).sort({ order: 1 }).exec((err, menus) => {
            res.locals.menus = menus

            // Insert current user
            data.users.findOne({ _id: req.session.userId }, (err, user) => {
                res.locals.user = user

                next();
            })
        })
    })

})

// For Widgets
router.use((req, res, next) => {

    data.posts.find({}).limit(10).sort({ createdAt: 1 }).exec((err, widgetPosts) => {
        res.locals.widgetPosts = widgetPosts

        data.comments.find({}).limit(10).sort({ createdAt: 1 }).exec((err, widgetComments) => {
            res.locals.widgetComments = widgetComments

            data.posts.find({}, { categories: 1 }).limit(10).sort({}).exec((err, widgetCategories) => {
                res.locals.widgetCategories = widgetCategories

                next()
            })
        })
    })

})

/*** Index ***/
router.get('/', function (req, res) {
    data.posts.find({}).limit(10).exec((err, posts) => {
        res.render('index', { posts })
    })
})

/*** Users ***/
router.get('/login', (req, res) => {
    res.render('login', {})
})

router.get('/signup', (req, res) => {
    res.render('signup')
})

/*** Search ***/
router.get('/search', (req, res) => {
    console.log("TODO : test")
    var query = req.query

    data.posts.find({ $or: [{ title: query }, { content: query }] }, (err, posts) => {
        res.render('posts', { posts: posts })
    })

})

/*** Posts ***/
router.get('/:postType', (req, res, next) => {
    var postType = req.params.postType
    var query = req.query

    data.customType.findOne({ name: postType }, (err, model) => {

        if (data[postType]) {

            data[postType].find(query, (err, posts) => {
                res.render('posts', { posts, model })
            })
            
        } else {
            next()
        }
    })



})

router.get('/:postType/:postId', (req, res, next) => {
    var postType = req.params.postType
    var postId = req.params.postId

    data[postType].findOne({ _id: postId }, (err, post) => {
        data.comments.find({ postId: postId }, (err, comments) => {
            res.render('post', { post: post, comments: comments })
        })
    })

})



module.exports = router;