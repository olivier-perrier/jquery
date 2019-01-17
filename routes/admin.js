var express = require('express');
var router = express.Router();

var data = require('../models/data.js')
var Post = data.model('Post')
var Setting = data.model('Setting')

router.get('/', (req, res) => {
  console.log("GET /admin")

  // DEBUG
  req.session.userId = "lFvBTABQpEluOzfv"

  var userId = req.session.userId

  if (userId == null) {
    res.send({ messsage: "forbidden: you must be logged to access admin" })

  } else {

    data.users.findOne({ _id: userId }, (err, user) => {

      data.posts.find({ postType: "post" }).limit(5).exec((err, posts) => {

        data.posts.find({ postType: "page" }).limit(5).exec((err, pages) => {

          res.render('admin/index', { user: user, posts: posts, pages: pages })

        })
      })
    })

  }

})



router.post('/menu/create/', (req, res) => {
  console.log("POST /admin/menu/create")

  var name = req.body.name
  var title = req.body.title
  var content = req.body.content
  var format = req.body.format

  Post.createMenu(title, name, content, format, (err, menu) => {
    if (menu) {
      res.send({ message: "success : new menu created", menu: menu })
    } else {
      res.send({ message: "internal error : impossible to create menu" })
    }
  })

})

router.post('/menu/save/', (req, res) => {
  console.log("POST /admin/menu/save")

  var name = req.body.name
  var title = req.body.title
  var content = req.body.content
  var format = req.body.format

  Post.updateMenu(title, name, content, format, (err, menu) => {
    if (menu) {
      res.send({ message: "success : new menu created", menu: menu })
    } else {
      res.send({ message: "internal error : impossible to create menu" })
    }
  })

})

router.post('/menu/delete/', (req, res) => {
  console.log("POST /admin/menu/delete")
  var menuName = req.body.name

  data.posts.remove({ postType: "menu", name: menuName }, (err, num) => {
    if (num == 0) {
      res.send({ menu: doc })
    } else {
      res.send({ message: "internal error : impossible to create menu" })
    }
  })
})

/*** Posts ***/
router.get('/posts', (req, res) => {
  console.log("POST /admin/posts")

  // DEBUG
  req.session.userId = "lFvBTABQpEluOzfv"

  var userId = req.session.userId

  if (userId == null) {
    res.send({ messsage: "forbidden: you must be logged to access admin" })

  } else {
    data.posts.find({ postType: "post" }, (err, posts) => {
      data.users.findOne({ _id: userId }, (err, user) => {

        res.render('admin/posts', { posts: posts, user: user })

      })
    })
  }

})

router.get('/post/create', (req, res, next) => {
  console.log("GET /admin/post/create")

  Post.createPost("", "", "", "", "", "", (err, post) => {
    res.redirect("/admin/posts/edit/" + post._id)
  })
})

router.get('/posts/edit/:postId', (req, res) => {
  console.log("GET /admin/posts/edit/:postId")
  var postId = req.params.postId

  data.posts.findOne({ _id: postId }, (err, doc) => {
    if (doc == null) {
      res.send({ message: "not found : no posts found" })
    } else {
      res.render('admin/post_edit', { post: doc })
    }
  })

})

/*** Menus ***/
router.get('/menu', (req, res) => {
  console.log("GET /admin/menu")

  // DEBUG
  req.session.userId = "lFvBTABQpEluOzfv"

  var userId = req.session.userId

  if (userId == null) {
    res.send({ messsage: "forbidden: you must be logged to access admin" })

  } else {
    data.posts.find({ postType: "menu" }, (err, menus) => {

      data.users.findOne({ _id: userId }, (err, user) => {

        res.render('admin/menu', { menus: menus, user: user })

      })
    })
  }

})

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
      res.send({ message: "not found : page not found " + page.name })
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

router.get('/user/create', (req, res, next) => {
  console.log("GET /admin/create")
  next()
})

router.get('/user/:userId', (req, res) => {
  console.log("GET /admin/user/:userId")

  var userId = req.params.userId

  data.users.findOne({ _id: userId }, (err, user) => {
    res.render('admin/user-edit', { user: user })
  })

})

module.exports = router;