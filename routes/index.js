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
        var settingsMapped = settings.reduce((obj, item) => {
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

/*** Users ***/
router.get('/login', (req, res) => {
    res.render('login', {})
})

router.get('/signup', (req, res) => {
    res.render('signup')
})

/*** Posts ***/
router.get('/:postType', (req, res) => {
    var postType = req.params.postType

    var query = req.query
    console.log(query)

    data[postType].find(query, (err, posts) => {
        // console.log(posts)
        res.render('posts', { posts })
    })

})

/*** Post ***/
router.get('/:postType/:postId', (req, res, next) => {
    var postType = req.params.postType
    var postId = req.params.postId

    data[postType].findOne({ _id: postId }, (err, post) => {
        data.comments.find({ postId: postId }, (err, comments) => {
            res.render('post', { post: post, comments: comments })
        })
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