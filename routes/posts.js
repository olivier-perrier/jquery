var express = require('express');
var router = express.Router();

var data = require('../models/data.js')
var Post = data.model('Post')
var User = data.model('User')


router.get('/:postId', (req, res) => {
  console.log("GET /posts/:postId")
  var postId = req.params.postId

  data.posts.findOne({ _id: postId }, (err, post) => {
    if (post == null) {
      res.send({ message: "not found : no posts found" })
    } else {
      data.posts.find({ postType: "menu" }, (err, menus) => {
        res.render('post', { post: post, menus: menus })
      })
    }
  })

})




module.exports = router;