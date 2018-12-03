var express = require('express');
var router = express.Router();

var data = require('../models/data.js')
var Post = data.model('Post')

router.get('/posts', (req, res) => {
  console.log("GET /API/posts")

  data.posts.find({}, (err, docs) => {
    if (docs == null) {
      res.send({ message: "not found : no posts found" })
    } else {
      res.send({message: "success : posts found", posts: docs })
    }
  })

})

router.post('/posts/create', (req, res) => {
  console.log("POST /API/posts/create")

  data.posts.insert(Post, (err, doc) => {
    if (doc == null) {
      res.send({ message: "internal error : impossible to create post" })
    } else {
      res.send({message: "success : post created" })
    }
  })

})

module.exports = router;