var express = require('express');
var router = express.Router();

var data = require('../components/data.js')

var authorizations = require('../components/authorizations')

// Print route
router.all("*", (req, res, next) => {
    console.log("[DEBUG] " + req.method + " " + req.baseUrl + req.path)
    next()
})

router.all("*", authorizations.requireAuthentication)

router.use((req, res, next) => {
    next();
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
// router.get('/', function (req, res) {
//     data.posts.find({}).limit(10).exec((err, posts) => {
//         res.render('index', { posts })
//     })
// })

/*** Users ***/
// router.get('/login', (req, res) => {
//     res.render('login', {})
// })

// router.get('/signup', (req, res) => {
//     res.render('signup')
// })

/*** Search ***/
//TODO Fonction de recherche
router.get('/search', (req, res) => {
    res.send({ message: "TODO" })
})

/*** Posts ***/
// router.get('/:postType', (req, res, next) => {
//     var postType = req.params.postType
//     var query = req.query

//     data.customType.findOne({ name: postType }, (err, model) => {

//         if (data[postType]) {

//             data[postType].find(query, (err, posts) => {
//                 res.render('posts', { posts, model })
//             })

//         } else {
//             next()
//         }
//     })



// })

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