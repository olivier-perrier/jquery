var express = require('express');
var router = express.Router();

var usersRouter = require('./users.js')
var postsRouter = require('./posts.js')

var data = require('../models/data.js')
var Post = data.model('Post')
var User = data.model('User')
var Comment = data.model('Comment')


router.use('/users', usersRouter);
router.use('/posts', postsRouter);


router.use((req, res, next) => {

  if (req.method == "POST") {

    console.log(req.method + " " + req.originalUrl)

    var defineRouteAccess = [
      { method: "POST", route: "/posts", autorisation: ["admin"] },
      { method: "POST", route: "/page", autorisation: ["admin"] },
      { method: "POST", route: "/menu", autorisation: ["admin"] },
      { method: "POST", route: "/user", autorisation: ["admin"] },
      { method: "POST", route: "/media", autorisation: ["admin"] },
      { method: "POST", route: "/comment", autorisation: ["admin", "author", "subscriber"] },

      { method: "POST", route: "/posts/create", autorisation: ["admin", "author"] },
      { method: "POST", route: "/posts/save", autorisation: ["admin", "author"] },
      { method: "POST", route: "/comment/delete", autorisation: ["admin", "author"] },
      { method: "POST", route: "/settings/save", autorisation: ["admin"] },

      { method: "GET", route: "/posts", autorisation: ["public"] },
      { method: "GET", route: "/categories", autorisation: ["public"] },
      { method: "GET", route: "/comments", autorisation: ["public"] },
    ]

    var routeAccess = defineRouteAccess.find(routeAccess => {
      routeAccess.method == req.method && routeAccess.route == req.path
    })
    if (routeAccess == null)
      routeAccess = defineRouteAccess.find(routeAccess => routeAccess.method == req.method && req.path.includes(routeAccess.route))


    if (routeAccess) {

      console.log("[DEBUG] route access autorisation " +
        routeAccess.method + " " +
        routeAccess.route + " " +
        routeAccess.autorisation
      )

      data.users.findOne({ _id: req.session.userId }, (err, user) => {
        if (user)
          if (routeAccess.autorisation == "public" || routeAccess.autorisation.includes(user.role)) {
            next()
          } else {
            console.log("[WARNING] attenting access not autorised API " + req.path)
            res.status(403).send({ message: "forbidden : you do not have the autorisation" })
          }
      })

    } else {
      console.log("[WARNING] no security route autorisation difined for " + req.path)
      //DEBUG autorise la route si elle n'est pas definit
      next()
    }

  } else {
    next()
  }


})

router.get('/posts', (req, res) => {
  console.log("GET /API/posts")

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

router.post('/post/save', (req, res) => {

  var postId = req.body.id
  var post = req.body.post

  post.name = post.name ? String(post.name).toLowerCase().replace(" ", "-") : "post-name",
    post.description = post.description || post.content.substring(0, 100)

  Post.updatePost(postId, post, (err, num) => {
    if (num)
      res.send({ message: "success : post updated " })
    else
      res.send({ message: "internal error : impossible to save post" })

  })
})

router.post('/posts/delete', (req, res) => {

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
    name: req.body.title ? req.body.title.toLowerCase().replace(" ", "-") : "page-name",
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

  var pageId = req.body.id
  var page = req.body.page

  page.name = page.name ? String(page.name).toLowerCase().replace(" ", "-") : "page-name"

  Post.updatePage(pageId, page, (err, num) => {
    if (num) {
      res.send({ message: "success : page updated" })
    } else {
      res.send({ message: "internal error : impossible to save page" })
    }
  })

})

router.post('/page/delete', (req, res) => {
  console.log("POST /API/page/delete")

  var pageId = req.body.id

  Post.removePage(pageId, (err, num) => {
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

  var menuId = req.body.id

  var menu = {
    title: req.body.title,
    content: req.body.content,
    format: req.body.format,
  }

  Post.updateMenu(menuId, menu, (err, num) => {
    if (num) {
      res.send({ message: "success : menu updated" })
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

router.post('/user/save', (req, res) => {
  console.log("POST /API/user/save")

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
    title: sampleFile.name,
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
        if (media)
          res.send({ message: "success : media created " + media })
        else
          res.send({ message: "internal error : impossible to save create " + media })

      })
    }

  })

})

router.post('/media/save', (req, res) => {
  console.log("POST /API/media/upload")

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


/*** Commments ***/

router.post('/comment/create', (req, res) => {
  console.log("POST /API/comment/create")

  var comment = req.body.comment

  comment.authorId = req.session.userId

  console.log(comment)

  Comment.create(comment, (err, comment) => {
    if (comment) {
      res.send({ message: "success : comment created", comment: comment })
    } else {
      res.send({ message: "internal error : impossible to create comment" })
    }
  })

})

router.post('/comment/delete', (req, res) => {
  console.log("POST /API/comment/delete")

  var commentId = req.body.id

  Comment.remove(commentId, (err, num) => {
    if (num) {
      res.send({ message: "success : comment deleted" })
    } else {
      res.send({ message: "internal error : impossible to delete comment" })
    }
  })

})

router.get('/comments', (req, res) => {
  console.log("GET /API/comments")

  data.comments.find({}).limit(10).exec((err, comments) => {
    res.send({ message: "success : comments found", comments: comments })
  })

})

/*** Categories ***/

router.get('/categories', (req, res) => {
  console.log("GET /API/categories")

  data.posts.find({ postType: "post" }, { category: 1, _id: 0 }, (err, categories) => {

    categories = categories.map(value => value.category)

    var uniqueCategories = [...new Set(categories)]

    res.send({ message: "success : categories found", categories: uniqueCategories })
  })

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