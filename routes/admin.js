var express = require('express');
var router = express.Router();

var async = require("async");

var op = require('../models/OP.js')

var data = require('../models/data.js')
var Post = data.model('Post')
var User = data.model('User')
var Comment = data.model('Comment')
var Setting = data.model('Setting')

router.all("*", (req, res, next) => {
  next()
})

router.use((req, res, next) => {
  next()
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

  var query = req.query

  Post.getPosts(query, (err, posts) => {
    res.render('admin/posts', { posts: posts })
  })

})

router.get('/posts/edit/:postId', (req, res) => {

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

  Post.getMenus((err, menus) => {
    res.render('admin/menus', { menus: menus })
  })

})

router.get('/menus/edit/:menuId', (req, res) => {

  var menuId = req.params.menuId

  var userId = req.session.userId

  data.posts.findOne({ _id: menuId, postType: "menu" }, (err, menu) => {
    res.render('admin/menu-edit', { menu: menu })
  })

})

/*** Pages ***/
router.get('/pages', (req, res) => {

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

  data.users.find({}, (err, users) => {
    res.render('admin/users', { users: users })
  })

})

router.get('/users/edit/:userId', (req, res) => {

  var userId = req.params.userId

  data.users.findOne({ _id: userId }, (err, user) => {
    res.render('admin/user-edit', { user: user })
  })

})

router.get('/settings', (req, res) => {

  res.render('admin/settings', {})

})

/*** Media ***/
router.get('/medias', (req, res) => {

  data.posts.find({ postType: "media" }, (err, medias) => {
    res.render('admin/medias', { medias: medias })

  })

})

router.get('/widgets', (req, res) => {

  res.render('admin/widgets', { widgets: op.getWidgets() })

})

/*** Comments ***/
router.get('/comments', (req, res) => {

  data.comments.find({}, (err, comments) => {
    res.render('admin/comments', { comments: comments })

  })

})

router.get('/comments/edit/:commentId', (req, res) => {

  var commentId = req.params.commentId

  var commentSchema = Comment.commentSchema

  data.comments.findOne({ _id: commentId }, (err, comment) => {

    for (var key in commentSchema) {

      // Add the default value
      for (var keyComment in comment) {
        if (keyComment == key) {

          commentSchema[key].value = comment[keyComment]

        }
      }
    }

    /*** Format relationships ***/

    async function myFunction(commentProp) {
      await data.posts.findOne({ _id: commentProp.value }, (err, post) => {
        if (post)
          commentProp.value = post.name
      })
    }

    async function myFunctionUser(commentProp) {
      await data.users.findOne({ _id: commentProp.value }, (err, user) => {
        if (user)
          commentProp.value = user.username
      })
    }

    async function myFunctionGeneric(database, commentProp) {
      database.findOne({ _id: commentProp.value }, (err, post) => {
        if (post)
          commentProp.value = post.name
      })
    }


    Object.values(commentSchema).map(commentProp => {

      if (commentProp.relationship)

        if (commentProp.ref == 'Post') {
          myFunction(commentProp)
        } else if (commentProp.ref == 'User') {
          myFunctionUser(commentProp)
        } else {
          commentProp.value = "QQTpZFtagjVrXqno"
          myFunctionGeneric(data[commentProp.ref], commentProp)
          data[commentProp.ref].findOne({ _id: commentProp.value }, (err, post) => {
            console.log(post)
          })
        }
    })


    res.render('admin/comments-edit', { comment: comment, commentSchema: commentSchema })


  })

})


module.exports = router;