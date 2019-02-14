var express = require('express');
var router = express.Router();

var op = require('../models/OP.js')

var data = require('../models/data.js')
var Post = data.model('Post')
var User = data.model('User')
var Setting = data.model('Setting')

router.get('/', (req, res) => {
  console.log("GET /admin")

  // DEBUG
  req.session.userId = "lFvBTABQpEluOzfv"

  var userId = req.session.userId

  data.users.findOne({ _id: userId }, (err, user) => {

    data.posts.find({ postType: "post" }).limit(5).exec((err, posts) => {

      data.posts.find({ postType: "page" }).limit(5).exec((err, pages) => {

        res.render('admin/index', { user: user, posts: posts, pages: pages })

      })
    })
  })


})


/*** Posts ***/
router.get('/posts', (req, res) => {
  console.log("GET /admin/posts")

  Post.getPosts({}, (err, posts) => {

    var authorIds = posts.map(post => post.authorId)

    User.getUsers(authorIds, (err, users) => {

      posts.forEach((post, i) => {

        var currentUser = users.find(user => {
          return posts[i].authorId == user._id
        })

        if (currentUser)
          posts[i].authorUsername = currentUser.username

      })

      res.render('admin/posts', { posts: posts })

    })

  })


})

router.get('/posts/edit/:postId', (req, res) => {
  console.log("GET /admin/posts/edit/:postId")
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
  console.log("GET /admin/menus")

  data.posts.find({ postType: "menu" }, (err, menus) => {

    res.render('admin/menus', { menus: menus })

  })

})

router.get('/menu/edit/:menuId', (req, res) => {
  console.log("GET /admin/menu/edit/:menuId")

  // DEBUG
  req.session.userId = "lFvBTABQpEluOzfv"

  var menuId = req.params.menuId
  var userId = req.session.userId

  if (userId == null) {
    res.send({ messsage: "forbidden: you must be logged to access admin" })

  } else {
    data.posts.findOne({ _id: menuId, postType: "menu" }, (err, menu) => {

      data.users.findOne({ _id: userId }, (err, user) => {

        res.render('admin/menu-edit', { menu: menu, user: user })

      })
    })
  }

})

/*** Pages ***/
router.get('/pages', (req, res) => {
  console.log("GET /admin/pages")

  // DEBUG
  req.session.userId = "lFvBTABQpEluOzfv"

  var userId = req.session.userId

  if (userId) {

    data.posts.find({ postType: "page" }, (err, pages) => {

      data.users.findOne({ _id: userId }, (err, user) => {

        res.render('admin/pages', { pages: pages, user: user })

      })
    })
  } else {
    res.send({ messsage: "forbidden: you must be logged to access admin" })

  }

})

router.get('/page/edit/:pageId', (req, res) => {
  console.log("GET /admin/page/edit/:pageId")

  var pageId = req.params.pageId

  data.posts.findOne({ _id: pageId }, (err, page) => {
    if (page) {
      res.render('admin/page-edit', { page: page })
    } else {
      res.send({ message: "not found : page not found for id" + pageId })
    }
  })

})

/*** Users ***/
router.get('/users', (req, res) => {
  console.log("GET /admin/users")

  data.users.find({}, (err, users) => {
    res.render('admin/users', { users: users })
  })

})

router.get('/user/edit/:userId', (req, res) => {
  console.log("GET /admin/user/edit/:userId")

  var userId = req.params.userId

  data.users.findOne({ _id: userId }, (err, user) => {
    res.render('admin/user-edit', { user: user })
  })

})

router.get('/settings', (req, res) => {
  console.log("GET /admin/settings")

  res.render('admin/settings', {})

})

/*** Media ***/
router.get('/media', (req, res) => {
  console.log("GET /admin/media")

  data.posts.find({ postType: "media" }, (err, medias) => {
    res.render('admin/media', { medias: medias })

  })

})

router.get('/widgets', (req, res) => {
  console.log("GET /admin/widgets")

  res.render('admin/widgets', { widgets: op.getWidgets() })

})


module.exports = router;