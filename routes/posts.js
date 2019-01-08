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

// Get post by name
// router.get('/:postName', (req, res) => {
//   console.log("GET /posts/:postName")

//   var postName = req.params.postName

//   data.posts.findOne({ name: postName }, (err, post) => {
//     if (post == null) {
//       res.send({ message: "not found : no posts found" })
//     } else {
//       data.posts.find({ postType: "menu" }, (err, menus) => {
//         res.render('post', { post: post, menus: menus })
//       })
//     }
//   })

// })

router.post('/save/:postId', (req, res) => {
  console.log("POST /posts/save/:postId")
  var postId = req.params.postId

  var postTitle = req.body.title
  var postName = req.body.name
  var postContent = req.body.content

  data.posts.update({ _id: postId }, { $set: { title: postTitle, name: postName, content: postContent } }, (err, num) => {

    if(num){
      res.send({ message: "success : post updated", postId: postId, name: postName })
    }else{
      res.send({ message: "not found : no post found for id ", postId })
    }

  })

})


module.exports = router;