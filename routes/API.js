var express = require('express');
var router = express.Router();

var data = require('../models/data.js')
var Post = data.model('Post')
var User = data.model('User')

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

  Post.createPost("New post", "post-1", "Content", "", "", "", (err, doc) => {
    res.send({ post: doc })
  })

})

router.post('/post/save', (req, res) => {
  console.log("POST /API/post/save")

  var id = req.body.id
  var title = req.body.title
  var name = req.body.name
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
    if (num) {
      res.send({ message: "success : post deleted" })
    } else {
      res.send({ message: "not found : no post found to delete for id " + postId })
    }
  })

})

router.post('/page/create', (req, res) => {
  console.log("POST /API/page/create")

  var title = req.body.title
  var name = String(title).toLowerCase().replace(" ", "-")
  var content = req.body.content

  Post.createPage(title, name, content, (err, page) => {
    if (page) {
      res.send({ message: "success : page created", menu: page })
    } else {
      res.send({ message: "internal error : impossible to create page" })
    }
  })

})

router.post('/page/save', (req, res) => {
  console.log("POST /API/page/save/")

  var id = req.body.id
  var title = req.body.title
  var name = String(req.body.name).toLowerCase().replace(" ", "-")
  var content = req.body.content
  var category = req.body.category
  var tags = req.body.tags
  var format = req.body.format

  Post.updatePage(id, title, name, content, category, tags, format, (err, page) => {
    if (page) {
      res.send({ message: "success : page saved", page: page })
    } else {
      res.send({ message: "internal error : impossible to save page" })
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

/*** Users ***/

router.post('/user/create', (req, res) => {
  console.log("POST /API/user/create")

  var username = req.body.username
  var role = req.body.role
  var email = req.body.email
  var password = req.body.password

  User.createUser(username, role, email, password, (err, user) => {
    if (user) {
      res.send({ message: "success : user created", user: user })
    } else {
      res.send({ message: "internal error : impossible to create user" })
    }
  })

})

router.post('/user/save', (req, res) => {
  console.log("POST /API/user/save")

  var id = req.body.id
  var username = req.body.username
  var role = req.body.role
  var email = req.body.email
  var password = req.body.password

  User.updateUser(id, username, role, email, password, (err, user) => {
    if (user) {
      res.send({ message: "success : user saved", user: user })
    } else {
      res.send({ message: "internal error : impossible to save user for id " + id })
    }
  })

})

router.post('/user/delete', (req, res) => {
  console.log("POST /API/user/delete")

  var id = req.body.id

  User.deleteUser(id, (err, num) => {
    if (num) {
      res.send({ message: "success : user deleted" + num })
    } else {
      res.send({ message: "internal error : impossible to delete user for id " + id })
    }
  })

})

/*** Settings ***/
router.post('/settings/save', (req, res) => {
  console.log("POST /API/settings/save")

  var settings = req.body.settings

  console.log(settings)
  // User.deleteUser(id, (err, num) => {
  //   if (num) {
  //     res.send({ message: "success : user deleted" + num })
  //   } else {
  //     res.send({ message: "internal error : impossible to delete user for id " + id })
  //   }
  // })

})

module.exports = router;