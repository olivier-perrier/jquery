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

    data.users.findOne({ _id: userId }, (err, doc) => {

      if (doc == null) {
        res.send({ messsage: "internal error : no user found for userId " + userId })

      } else {
        res.render('admin/index', { user: doc })
      }
    })

  }

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

router.get('/posts/create/', (req, res) => {
  console.log("GET /admin/posts/create")
  var postId = req.params.postId

  Post.createPost("Lorem ipsum", "zerzerzerze", (err, doc) => {
    if (doc) {
      res.render('admin/post_edit', { post: doc })
    } else {
      res.send({ message: "internal error : impossible to create post" })
    }
  })


})

router.post('/menu/create/', (req, res) => {
  console.log("POST /admin/menu/create")
  var menuName = req.body.name

  data.settings.findOne({ name: "menu" }, (err, doc) => {
    var oldMenu = doc.value
    var newMenu = doc.value.concat([{ name: menuName }])

    data.settings.update({ name: "menu" }, { $set: { value: newMenu } }, (err, doc) => {
      if (doc) {
        res.send({ menu: doc })
      } else {
        res.send({ message: "internal error : impossible to create menu" })
      }
    })

  })
})

router.get('/posts', (req, res) => {
  console.log("POST /admin/posts")

  // DEBUG
  req.session.userId = "lFvBTABQpEluOzfv"

  var userId = req.session.userId

  if (userId == null) {
    res.send({ messsage: "forbidden: you must be logged to access admin" })

  } else {
    data.posts.find({}, (err, posts) => {
      data.users.findOne({ _id: userId }, (err, user) => {

        res.render('admin/posts', { posts: posts, user: user })

      })
    })
  }

})

router.get('/menu', (req, res) => {
  console.log("GET /admin/menu")

  // DEBUG
  req.session.userId = "lFvBTABQpEluOzfv"

  var userId = req.session.userId

  if (userId == null) {
    res.send({ messsage: "forbidden: you must be logged to access admin" })

  } else {
    data.settings.findOne({ name: "menu" }, (err, menu) => {

      data.users.findOne({ _id: userId }, (err, user) => {

        res.render('admin/menu', { menu: menu.value, user: user })

      })
    })
  }

})

module.exports = router;