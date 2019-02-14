var express = require('express');
var router = express.Router();

var usersRouter = require('./users.js')
var postsRouter = require('./posts.js')

var data = require('../models/data.js')
var Post = data.model('Post')
var User = data.model('User')


router.use('/users', usersRouter);
router.use('/posts', postsRouter);


router.post('/posts', (req, res) => {
  console.log("POST /API/posts")

  data.posts.find({ postType: "post" }, (err, posts) => {
    res.send({ message: "success : posts found", posts: posts })
  })

})

router.post('/posts/create', (req, res) => {
  console.log("POST /API/posts/create")

  var post = {
    title: req.body.title || "Post title",
    name: String(req.body.title).toLowerCase().replace(" ", "-") || "post-name",
    authorId: req.session.userId,
  }

  Post.createPost(post, (err, post) => {
    res.send({ message: "success : post created ", post: post })
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
    image: req.body.image,
  }

  Post.updatePost(post.id, post, (err, num) => {
    res.send({ message: "success : post updated " + num, postId: post.id })
  })
})

router.post('/posts/delete', (req, res) => {
  console.log("POST /API/posts/delete")

  var postId = req.body.id

  Post.removePost(postId, (err, num) => {
    res.send({ message: "success : post removed " + num })
  })

})

/*** Pages ***/
router.post('/page/create', (req, res) => {
  console.log("POST /API/page/create")

  var page = {
    title: req.body.title || "Page title",
    name: String(req.body.title).toLowerCase().replace(" ", "-") || "page-name",
    authorId: req.session.userId,
  }

  Post.createPage(page, (err, page) => {
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

  Post.removePage(id, (err, num) => {
    if (num) {
      res.send({ message: "success : page deleted" })
    } else {
      res.send({ message: "internal error : impossible to delete page" })
    }
  })

})

/*** Menus ***/
router.post('/menu/create/', (req, res) => {
  console.log("POST /API/menu/create")

  var menu = {
    title: req.body.title,
    content: req.body.content,
    format: req.body.format
  }

  Post.createMenu(menu, (err, menu) => {
    if (menu) {
      res.send({ message: "success : menu created", menu: menu })
    } else {
      res.send({ message: "internal error : impossible to create menu" })
    }
  })

})

router.post('/menu/save/', (req, res) => {
  console.log("POST /API/menu/save")

  var menu = {
    id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    format: req.body.format,
  }

  console.log(menu)

  Post.updateMenu(menu.id, menu, (err, num) => {
    if (num) {
      res.send({ message: "success : new menu updated" })
    } else {
      res.send({ message: "internal error : impossible to update menu" })
    }
  })

})

router.post('/menu/delete/', (req, res) => {
  console.log("POST /API/menu/delete")

  var menuId = req.body.id

  Post.removeMenu(menuId, (err, num) => {
    if (num) {
      res.send({ message: "success : menu removed" })
    } else {
      res.send({ message: "internal error : impossible to remove menu" })
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

/*** Medias ***/
router.post('/media/upload', (req, res) => {
  console.log("POST /API/media/upload")

  console.log(req.files)

  let sampleFile = req.files.sampleFile;

  console.log(sampleFile.name)

  var media = {
    name: sampleFile.name,
    postType: "media",
    format: "image"
  }

  sampleFile.mv('./public/media/' + sampleFile.name, function (err) {
    if (err) {
      console.log("[ERROR] moving uploaded file " + err)
      res.send({ message: "internal error : error moving the file " + sampleFile.name })

    } else {

      Post.createMedia(media, (err, media) => {
        res.send({ message: "success : media created " + media })
      })
    }

  })

})

router.post('/media/delete', (req, res) => {
  console.log("POST /API/media/delete")

  var id = req.body.id

  const fs = require('fs')

  Post.getMedia(id, (err, media) => {

    fs.unlink('./public/media/' + media.name, (err) => {

      if (err) {
        console.log("[ERROR] no file to delete " + media.name + " err:" + err)

      } else {
        console.log("[SUCCESS] file deleted " + media.name)
      }
    })

  })

  Post.deleteMedia(id, (err, num) => {
    if (num) {
      res.send({ message: "success : media deleted" + num })
    } else {
      res.send({ message: "internal error : impossible to delete media for id " + id })
    }
  })

  // Todo delete the file (not only the media post)

})

/*** Widgets ***/


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