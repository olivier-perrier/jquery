var express = require('express');
var router = express.Router();

var data = require('../models/data.js')
var Post = data.model('Post')

router.get('/posts', (req, res) => {
  console.log("GET /API/posts")

  data.posts.find({ postType: "post" }, (err, posts) => {
    if (posts == null) {
      res.send({ message: "not found : no posts found" })
    } else {
      res.send({ message: "success : posts found", posts: posts })
    }
  })

})

router.post('/posts/create', (req, res) => {
  console.log("POST /API/posts/create")

  Post.createPost("Lorem ipsum", "zerzerzerze", (err, doc) => {
    if (doc) {
      res.send({post : doc})
    }
  })

})

router.post('/posts/delete/:postId', (req, res) => {
  console.log("POST /API/posts/delete/:postId")

  var postId = req.params.postId

  data.posts.remove({ _id: postId }, (err, num) => {
    if (num == 0) {
      res.send({ message: "not found : no post found to delete " + postId })
    } else {
      res.send({ message: "success : post deleted" })
    }
  })

})

module.exports = router;