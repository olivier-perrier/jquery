var express = require('express');
var router = express.Router();

var op = require('../models/OP.js')

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

router.post('/posts', (req, res) => {
  console.log("POST /API/posts")

  data.posts.find({ postType: "post" }, (err, posts) => {
    res.send({ message: "success : posts found", posts: posts })
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

  var post = {
    id: req.body.id,
    title: req.body.title,
    name: req.body.name,
    content: req.body.content,
    description: req.body.description,
    category: req.body.category,
    tags: req.body.tags,
    format: req.body.format,
  }

  Post.updatePost(post, (err, num) => {

    res.send({ message: "success : post updated " + num, postId: post.id })

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

/*** Pages ***/
router.post('/page/create', (req, res) => {
  console.log("POST /API/page/create")

  var title = req.body.title || "title"
  var name = String(title).toLowerCase().replace(" ", "-") || "name"
  var content = req.body.content

  Post.createPage(title, name, content, (err, page) => {
    if (page) {
      res.send({ message: "success : page created", page: page })
    } else {
      res.send({ message: "internal error : impossible to create page" })
    }
  })

})

router.post('/page/save', (req, res) => {
  console.log("POST /API/page/save/")

  var page = {
    id: req.body.id,
    title: req.body.title,
    name: String(req.body.name).toLowerCase().replace(" ", "-"),
    content: req.body.content,
    category: req.body.category,
    tags: req.body.tags,
    format: req.body.format,
  }

  Post.updatePage(page, (err, page) => {
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

/*** Widgets ***/
// router.get('/widgets', (req, res) => {
//   console.log("GET /API/widgets")

//   Object.entries(settings).forEach(([key, valeur]) => {
//     data.settings.update({ name: key }, { $set: { value: valeur } })
//   })

//   res.send({ message: "success : returned widgets", widgets : op.getWidgets() })

// })

/*** Settings ***/
router.post('/settings/save', (req, res) => {
  console.log("POST /API/settings/save")

  var settings = req.body.settings

  Object.entries(settings).forEach(([key, valeur]) => {
    data.settings.update({ name: key }, { $set: { value: valeur } })
  })

  res.send({ message: "success : settings updated" })

})

module.exports = router;