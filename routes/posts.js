var express = require('express');
var router = express.Router();

var data = require('../models/data.js')
var Post = data.model('Post')
var User = data.model('User')


router.get('/:postId', (req, res) => {
  console.log("GET /posts/:postId")
  var postId = req.params.postId

  data.posts.findOne({ _id: postId }, (err, doc) => {
    if (doc == null) {
      res.send({ message: "not found : no posts found" })
    } else {
      doc.createdAt = doc.createdAt.toDateString()
      res.render('post', { post: doc })
    }
  })

})

router.post('/save/:postId', (req, res) => {
  console.log("POST /posts/save/:postId")
  var postId = req.params.postId

  var postName = req.body.name
  var postContent = req.body.content
  var postType = req.body.postType
  var postContentPreview = req.body.content.substring(1, 50)

  data.posts.findOne({ _id: postId }, (err, doc) => {
    if (doc == null) {
      res.send({ message: "not found : no posts found" + postId })
    } else {
      data.posts.update({ _id: postId }, { $set: { name: postName, content: postContent, contentPreview: postContentPreview, postType: postType } }, (err, num) => {

        res.send({ message: "success : post updated", postId: postId, name: postName})
      })
    }

  })

})


module.exports = router;