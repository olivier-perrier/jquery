var express = require('express');
var router = express.Router();

var opkey = require('../models/opkey')
var opkey = new opkey()

var usersRouter = require('./users.js')
var postsRouter = require('./posts.js')

var data = require('../models/data.js')
var Post = data.model('Post')
var Page = data.model('Page')
var User = data.model('User')
var Comment = data.model('Comment')

router.use('/users', usersRouter);
router.use('/posts', postsRouter);

router.use((req, res, next) => {
  next()
})

router.get('/posts', (req, res) => {

  data.posts.find({ postType: "post" }).limit(10).exec((err, posts) => {
    res.send({ message: "success : posts found", posts: posts })
  })

})

router.post('/posts/create', (req, res) => {

  var post = {
    title: req.body.title,
    name: "post-name",
    authorId: req.session.userId,
  }

  Post.createPost(post, (err, post) => {
    res.send({ message: "success : post created ", post: post })
  })

})

router.post('/posts/save', (req, res) => {

  var postId = req.body.id
  var post = req.body.post

  if (post.name)
    post.name = String(post.name).toLowerCase().replace(" ", "-")
  else if (post.title)
    post.name = String(post.title).toLowerCase().replace(" ", "-")
  else
    post.name = "post-name"
  post.tags = post.tags ? post.tags.split(",") : ""

  Post.updatePost(postId, post, (err, num) => {
    if (num)
      res.send({ message: "success : post updated " })
    else
      res.send({ message: "internal error : impossible to save post" })

  })
})

router.post('/posts/trash', (req, res) => {

  var postId = req.body.id

  var post = {
    status: "trash"
  }

  Post.updatePost(postId, post, (err, num) => {
    res.send({ message: "success : post removed " + num })
  })

})

router.post('/posts/delete', (req, res) => {

  var postId = req.body.id

  Post.removePost(postId, (err, num) => {
    res.send({ message: "success : post removed " + num })
  })

})

/*** Pages ***/
router.post('/pages/create', (req, res) => {

  var post = req.body.post || {}

  post.authorId = req.session.userId

  Page.create(post, (err, post) => {
    if (post) {
      res.send({ message: "success : page created", post: post })
    } else {
      res.send({ message: "internal error : impossible to create post" })
    }
  })

})

router.post('/pages/save', (req, res) => {

  var postId = req.body.id
  var post = req.body.post

  console.log(post)

  Page.update(postId, post, (err, num) => {
    if (num) {
      res.send({ message: "success : page updated" })
    } else {
      res.send({ message: "internal error : impossible to save page" })
    }
  })

})

router.post('/pages/delete', (req, res) => {

  var postId = req.body.id

  Page.remove(postId, (err, num) => {
    if (num) {
      res.send({ message: "success : page deleted" })
    } else {
      res.send({ message: "internal error : impossible to delete page" })
    }
  })

})

/*** Menus ***/
router.post('/menus/create/', (req, res) => {

  var menu = req.body.menu

  Post.createMenu(menu, (err, menu) => {
    if (menu) {
      res.send({ message: "success : menu created", menu: menu })
    } else {
      res.send({ message: "internal error : impossible to create menu" })
    }
  })

})

router.post('/menus/save/', (req, res) => {

  var menuId = req.body.id
  var menu = req.body.menu

  Post.updateMenu(menuId, menu, (err, num) => {
    if (num) {
      res.send({ message: "success : menu updated" })
    } else {
      res.send({ message: "internal error : impossible to update menu" })
    }
  })

})

router.post('/menus/delete/', (req, res) => {

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

router.post('/users/create', (req, res) => {

  var user = {
    username: req.body.username,
    role: req.body.role,
    email: req.body.email,
    password: req.body.password,
  }

  User.create(user, (err, user) => {
    if (user) {
      res.send({ message: "success : user created", user: user })
    } else {
      res.send({ message: "internal error : impossible to create user" })
    }
  })

})

router.post('/users/save', (req, res) => {

  var id = req.body.id

  var user = {
    username: req.body.username,
    role: req.body.role,
    email: req.body.email,
    password: req.body.password,
  }

  User.update(id, user, (err, num) => {
    if (num) {
      res.send({ message: "success : user updated" })
    } else {
      res.send({ message: "internal error : impossible to save user for id " + id })
    }
  })

})

router.post('/users/delete', (req, res) => {

  var id = req.body.id

  User.remove(id, (err, num) => {
    if (num) {
      res.send({ message: "success : user deleted" + num })
    } else {
      res.send({ message: "internal error : impossible to delete user for id " + id })
    }
  })

})

/*** Medias ***/
router.post('/medias/upload', (req, res) => {

  console.log(req.files)

  let sampleFile = req.files.sampleFile;

  console.log(sampleFile.name)

  var media = {
    title: sampleFile.name,
    name: sampleFile.name,
    postType: "media",
    format: "image"
  }

  sampleFile.mv('./public/medias/' + sampleFile.name, function (err) {
    if (err) {
      console.log("[ERROR] moving uploaded file " + err)
      res.send({ message: "internal error : error moving the file " + sampleFile.name })

    } else {

      Post.createMedia(media, (err, media) => {
        if (media)
          res.send({ message: "success : media created " + media })
        else
          res.send({ message: "internal error : impossible to save create " + media })

      })
    }

  })

})

router.post('/medias/save', (req, res) => {

  var mediaId = req.body.id

  var media = {
    title: req.body.title,
    name: req.body.name,
  }


  Post.updateMedia(mediaId, media, (err, num) => {
    if (num)
      res.send({ message: "success : media updated" })
    else
      res.send({ message: "internal error : impossible to updated media " + media })

  })


})

router.post('/medias/delete', (req, res) => {

  var id = req.body.id

  const fs = require('fs')

  Post.getMedia(id, (err, media) => {

    fs.unlink('./public/medias/' + media.name, (err) => {

      if (err) {
        console.log("[ERROR] no file to delete " + media.name + " err:" + err)

      } else {
        console.log("[SUCCESS] file deleted " + media.name)
      }
    })

  })

  Post.removeMedia(id, (err, num) => {
    if (num) {
      res.send({ message: "success : media deleted" + num })
    } else {
      res.send({ message: "internal error : impossible to delete media for id " + id })
    }
  })

  // Todo delete the file (not only the media post)

})


/*** Commments ***/



/*** Categories ***/

router.get('/categories', (req, res) => {

  data.posts.find({ postType: "post" }, { category: 1, _id: 0 }, (err, categories) => {

    categories = categories.map(value => value.category)

    var uniqueCategories = [...new Set(categories)]

    res.send({ message: "success : categories found", categories: uniqueCategories })
  })

})

/*** Widgets ***/

/*** Settings ***/
router.post('/settings/save', (req, res) => {

  var settings = req.body.settings

  Object.entries(settings).forEach(([key, valeur]) => {
    data.settings.update({ name: key }, { $set: { value: valeur } })
  })

  res.send({ message: "success : settings updated" })

})

/*** Generic routes ***/
router.post('/:postType/create', (req, res) => {

  var postType = req.params.postType

  var model = opkey.getModel(postType)

  var post = req.body.post || {}
  post.authorId = req.session.userId

  model.create(post, (err, post) => {
    if (post) {
      res.send({ message: "success : comment created", post: post })
    } else {
      res.send({ message: "internal error : impossible to create post" })
    }
  })

})

router.post('/:postType/save', (req, res) => {
  var postType = req.params.postType

  var id = req.body.id
  var post = req.body.post

  var model = opkey.getModel(postType)

  model.update(id, post, (err, num) => {
    if (num) {
      res.send({ message: "success : post updated" })
    } else {
      res.send({ message: "internal error : impossible to save post" })
    }
  })

})

router.post('/:postType/delete', (req, res) => {
  var postType = req.params.postType

  var model = opkey.getModel(postType)

  var postId = req.body.id

  model.remove(postId, (err, num) => {
    if (num) {
      res.send({ message: "success : comment deleted" })
    } else {
      res.send({ message: "internal error : impossible to delete comment" })
    }
  })

})

router.get('/:postType', (req, res) => {
  console.log("not tested")
  var postType = req.params.postType

  var model = opkey.getModel(postType)

  model.getAll().limit(10).exec((err, comments) => {
    res.send({ message: "success : posts found", posts: posts })
  })

})

module.exports = router;