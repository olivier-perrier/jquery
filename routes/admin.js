var express = require('express');
var router = express.Router();

var async = require("async");

var data = require('../models/data.js')
var Post = data.model('Post')
var Page = data.model('Page')
var User = data.model('User')
var Comment = data.model('Comment')
var Setting = data.model('Setting')

router.all("*", (req, res, next) => {
  next()
})

router.use((req, res, next) => {
  next()
})

router.get('/', (req, res) => {
  var userId = req.session.userId

  data.users.find({}).limit(5).exec((err, users) => {

    data.posts.find({ postType: "post" }).limit(5).exec((err, posts) => {

      data.posts.find({ postType: "page" }).limit(5).exec((err, pages) => {

        res.render('admin/index', { users: users, posts: posts, pages: pages })

      })
    })
  })


})

/*** Posts ***/
router.get('/posts', (req, res) => {

  var query = req.query

  Post.getPosts(query, (err, posts) => {
    res.render('admin/posts', { posts: posts })
  })

})

router.get('/posts/edit/:postId', (req, res) => {

  var postId = req.params.postId

  Post.getPost(postId, (err, post) => {
    if (post == null) {
      res.send({ message: "not found : no posts found" })
    } else {
      res.render('admin/post-edit', { post: post })
    }
  })

})

/*** Menus ***/
router.get('/menus', (req, res) => {

  Post.getMenus((err, menus) => {
    res.render('admin/menus', { menus: menus })
  })

})

router.get('/menus/edit/:menuId', (req, res) => {

  var menuId = req.params.menuId

  var userId = req.session.userId

  data.posts.findOne({ _id: menuId, postType: "menu" }, (err, menu) => {
    res.render('admin/menu-edit', { menu: menu })
  })

})

/*** Pages ***/
router.get('/pages', (req, res) => {
  sendGenericPosts(res, Page)
})

router.get('/pages/edit/:pageId', (req, res) => {
  var pageId = req.params.pageId
  sendGenericPost(res, Page, pageId)
})

/*** Users ***/
router.get('/users', (req, res) => {

  data.users.find({}, (err, users) => {
    res.render('admin/users', { users: users })
  })

})

router.get('/users/edit/:userId', (req, res) => {

  var userId = req.params.userId

  data.users.findOne({ _id: userId }, (err, user) => {
    res.render('admin/user-edit', { user: user })
  })

})

router.get('/settings', (req, res) => {

  res.render('admin/settings', {})

})

/*** Media ***/
router.get('/medias', (req, res) => {

  data.posts.find({ postType: "media" }, (err, medias) => {
    res.render('admin/medias', { medias: medias })

  })

})

router.get('/widgets', (req, res) => {
  // res.render('admin/widgets', { widgets: op.getWidgets() })
  res.redirect("/admin/")
})

/*** Comments ***/
router.get('/comments', (req, res) => {
  sendGenericPosts(res, Comment)
})

router.get('/comments/edit/:commentId', (req, res) => {
  var commentId = req.params.commentId
  sendGenericPost(res, Comment, commentId)

})

function sendGenericPosts(res, model) {
  var properties = model.getProperties()

  data[properties.name].find({}, model.getProjection(), (err, posts) => {

    model.getBuildPosts(posts).then((result) => {
      // console.log(result)
      res.render('admin/comments', { schema: model.schema, posts: result, columns: model.getColumnsTitles(), properties: model.properties })
    })
  })
}

function sendGenericPost(res, model, postId) {
  var properties = model.getProperties()

  data[properties.name].findOne({ _id: postId }, (err, post) => {

    model.getBuildPost(post).then(result => {
      // console.log(result)
      res.render('admin/comments-edit', { post: result, properties: properties })
    })
  })
}


module.exports = router;