var express = require('express');
var router = express.Router();

var data = require('../models/data.js')
var Post = data.model('Post')

router.get('/', (req, res) => {
  console.log("GET /posts")

  data.posts.find({}, (err, docs) => {
    if (docs == null) {
      res.send({ message: "not found : no posts found" })
    } else {
      res.render('posts', { posts: docs })
    }
  })

})

router.get('/:postId', (req, res) => {
  console.log("GET /posts/:postId")
  var postId = req.params.postId

  data.posts.findOne({ _id: postId }, (err, doc) => {
    if (doc == null) {
      res.send({ message: "not found : no posts found" })
    } else {
      res.render('post', { post: doc })
    }
  })

})

router.get('/edit/:postId', (req, res) => {
  console.log("GET /posts/edit/:postId")
  var postId = req.params.postId

  data.posts.findOne({ _id: postId }, (err, doc) => {
    if (doc == null) {
      res.send({ message: "not found : no posts found" })
    } else {
      res.render('post_edit', { post: doc })
    }
  })

})

router.post('/save/:postId', (req, res) => {
  console.log("POST /posts/save/:postId")
  var postId = req.params.postId

  var postName = req.body.name
  var postContent = req.body.content

  console.log(postId)

  data.posts.findOne({ _id: postId }, (err, doc) => {
    if (doc == null) {
      res.send({ message: "not found : no posts found" + postId })
    } else {
      data.posts.update({ _id: postId }, { $set: { name: postName, content: postContent } }, (err, num) => {

        res.send({ message: "success : post updated", name: postName, content: postContent })
      })
    }

  })

})

  module.exports = router;