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

  Post.createPost("Lorem ipsum", "post_x", "zerzerzerze", "family", (err, doc) => {
    if (doc) {
      res.send({ post: doc })
    }
  })

})

router.post('/post/save', (req, res) => {
  console.log("POST /API/post/save")

  var id = req.body.id
  var name = req.body.title
  var title = req.body.name
  var content = req.body.content
  var category = req.body.category
  var tags = req.body.tags
  var format = req.body.format

  Post.updatePost(id, title, name, content, category, tags, format, (err, num) => {

    res.send({ message: "success : post updated " + num, postId: id })

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

router.post('/page/create', (req, res) => {
  console.log("POST /API/page/create")

  var name = req.body.name
  var title = req.body.title
  var content = req.body.content

  Post.createPage(title, name, content, (err, page) => {
    if (page) {
      res.send({ message: "success : page created", menu: page })
    } else {
      res.send({ message: "internal error : impossible to create page" })
    }
  })

})

router.post('/page/delete', (req, res) => {
  console.log("POST /API/page/delete")

  var id = req.body.id

  Post.deletePage(id, (err, num) => {
    if (num) {
      res.send({ message: "success : page deleted" })
    } else {
      res.send({ message: "internal error : impossible to delete page" })
    }
  })

})

module.exports = router;