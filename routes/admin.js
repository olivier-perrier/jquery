var express = require('express');
var router = express.Router();

var op = require('../models/OP.js')

var data = require('../models/data.js')
var Post = data.model('Post')
var User = data.model('User')
var Setting = data.model('Setting')

router.all("*", (req, res, next) => {
  console.log("router all")
  next()
})

router.use((req, res, next) => {

  console.log(req.method + " " + req.baseUrl + req.path)

  var defineRouteAccess = [
    { method: "GET", route: "/admin/", autorisation: ["admin"] },

    { method: "GET", route: "/admin/posts", autorisation: ["admin"] },
    { method: "GET", route: "/admin/posts/edit/:", autorisation: ["admin"] },

    { method: "GET", route: "/admin/pages", autorisation: ["admin"] },
    { method: "GET", route: "/admin/pages/edit/:", autorisation: ["admin"] },

    { method: "GET", route: "/admin/menus", autorisation: ["admin", "author"] },
    { method: "GET", route: "/admin/menus/edit/:", autorisation: ["admin"] },

    { method: "GET", route: "/admin/users", autorisation: ["admin"] },
    { method: "GET", route: "/admin/users/edit/:", autorisation: ["admin"] },

    { method: "GET", route: "/admin/medias", autorisation: ["author"] },

    { method: "GET", route: "/admin/comments", autorisation: ["admin", "author", "subscriber"] },
    { method: "GET", route: "/admin/comments/edit/:", autorisation: ["admin", "author", "subscriber"] },

    { method: "GET", route: "/admin/widgets", autorisation: ["admin"] },

    { method: "GET", route: "/admin/settings", autorisation: ["admin"] },

  ]

  var routeAccess = defineRouteAccess.find(routeAccess => {
    return routeAccess.method == req.method && routeAccess.route == req.baseUrl + req.path
  })

  if (routeAccess == null) {
    routeAccess = defineRouteAccess.find(routeAccess => {
      return routeAccess.route.includes(":") &&
        routeAccess.method == req.method &&
        req.originalUrl.includes(routeAccess.route.replace(":", ""))
    })
  }

  if (routeAccess) {

    console.log("[DEBUG] route access autorisation " +
      routeAccess.method + " " +
      routeAccess.route + " " +
      routeAccess.autorisation
    )

    data.users.findOne({ _id: req.session.userId }, (err, user) => {
      if (user) {
        if (routeAccess.autorisation == "public" || routeAccess.autorisation.includes(user.role)) {
          next()
        } else {
          console.log("[WARNING] attenting access not autorised route " + req.baseUrl + req.path)
          res.status(403).send({ message: "forbidden : you do not have the autorisation" })
        }
      } else {
        console.log("[WARNING] no user found for your id " + req.session.userId)
        res.redirect("/login")
      }
    })

  } else {
    console.log("[WARNING] no security route autorisation defined for " + req.baseUrl + req.path)
    //DEBUG autorise la route si elle n'est pas definit
    next()
  }

})

router.get('/', (req, res) => {
  var userId = req.session.userId

  data.users.find({}).limit(5).exec((err, users) => {

    data.posts.find({ postType: "post" }).limit(5).exec((err, posts) => {

      data.posts.find({ postType: "page" }).limit(5).exec((err, pages) => {

        res.render('admin/index', { users: users, posts: posts, pages: pages })

      })
    })
  })


})

/*** Posts ***/
router.get('/posts', (req, res) => {
  console.log("GET /admin/posts")

  Post.getPosts({}, (err, posts) => {
    res.render('admin/posts', { posts: posts })
  })

})

router.get('/posts/edit/:postId', (req, res) => {
  console.log("GET /admin/posts/edit/:postId")

  var postId = req.params.postId

  Post.getPost(postId, (err, post) => {
    if (post == null) {
      res.send({ message: "not found : no posts found" })
    } else {
      res.render('admin/post-edit', { post: post })
    }
  })

})

/*** Menus ***/
router.get('/menus', (req, res) => {
  console.log("GET /admin/menus")

  data.posts.find({ postType: "menu" }, (err, menus) => {

    res.render('admin/menus', { menus: menus })

  })

})

router.get('/menus/edit/:menuId', (req, res) => {
  console.log("GET /admin/menu/edit/:menuId")

  var menuId = req.params.menuId

  var userId = req.session.userId

  data.posts.findOne({ _id: menuId, postType: "menu" }, (err, menu) => {
    res.render('admin/menu-edit', { menu: menu })
  })

})

/*** Pages ***/
router.get('/pages', (req, res) => {
  console.log("GET /admin/pages")

  var userId = req.session.userId

  if (userId) {

    data.posts.find({ postType: "page" }, (err, pages) => {

      data.users.findOne({ _id: userId }, (err, user) => {

        res.render('admin/pages', { pages: pages, user: user })

      })
    })
  } else {
    res.send({ messsage: "forbidden: you must be logged to access admin" })

  }

})

router.get('/pages/edit/:pageId', (req, res) => {
  console.log("GET /admin/pages/edit/:pageId")

  var pageId = req.params.pageId

  data.posts.findOne({ _id: pageId }, (err, page) => {
    if (page) {
      res.render('admin/page-edit', { page: page })
    } else {
      res.send({ message: "not found : page not found for id" + pageId })
    }
  })

})

/*** Users ***/
router.get('/users', (req, res) => {
  console.log("GET /admin/users")

  data.users.find({}, (err, users) => {
    res.render('admin/users', { users: users })
  })

})

router.get('/users/edit/:userId', (req, res) => {
  console.log("GET /admin/users/edit/:userId")

  var userId = req.params.userId

  data.users.findOne({ _id: userId }, (err, user) => {
    res.render('admin/user-edit', { user: user })
  })

})

router.get('/settings', (req, res) => {
  console.log("GET /admin/settings")

  res.render('admin/settings', {})

})

/*** Media ***/
router.get('/medias', (req, res) => {
  console.log("GET /admin/medias")

  data.posts.find({ postType: "media" }, (err, medias) => {
    res.render('admin/medias', { medias: medias })

  })

})

router.get('/widgets', (req, res) => {
  console.log("GET /admin/widgets")

  res.render('admin/widgets', { widgets: op.getWidgets() })

})


module.exports = router;