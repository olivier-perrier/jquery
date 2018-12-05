var express = require('express');
var router = express.Router();

var data = require('../models/data.js')
var Post = data.model('Post')

router.get('/', (req, res) => {
  console.log("GET /admin")

  DEBUG_fakeLogin(req)
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

function DEBUG_fakeLogin(req) {
  req.session.userId = "lFvBTABQpEluOzfv"
}

router.get('/posts', (req, res) => {
  console.log("POST /admin/posts")

  DEBUG_fakeLogin(req)
  var userId = req.session.userId

  if (userId == null) {
    res.send({ messsage: "forbidden: you must be logged to access admin" })

  } else {
    data.posts.find({}, (err, posts) => {
      data.users.findOne({ _id: userId}, (err, user) => {
        
        res.render('admin/posts', { posts: posts, user: user })

      })
    })
  }

})

module.exports = router;