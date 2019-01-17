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

  var postId = req.body.id
  var postTitle = req.body.title
  var postName = req.body.name
  var postContent = req.body.content
  var postCategory = req.body.category
  var postTags = req.body.tags

  data.posts.update({ _id: postId }, { $set: { title: postTitle, name: postName, content: postContent, category: postCategory, tags: postTags } }, (err, num) => {

    res.send({ message: "success : post updated " + num, postId: postId })

  })
})

router.post('/post/save2', (req, res) => {
  console.log("POST /API/post/save2")

  var postId = req.body.id
  var postTitle = req.body.title
  var postName = req.body.name
  var postContent = req.body.content
  var postCategory = req.body.category
  var postTags = req.body.tags
  
  var post = {
    tags : postTags
  }

  Post.updatePost(postId, post, (err, num) => {

    res.send({ message: "success : post updated " + num, post: post })
  
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