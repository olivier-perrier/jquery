var express = require('express');
var router = express.Router();

var opkey = require('../models/opkey')
var opkey = new opkey()

var data = require('../models/data.js')
var Post = data.model('Post')
var User = data.model('User')
var Setting = data.model('Setting')

router.all("*", (req, res, next) => {
  next()
})

router.use((req, res, next) => {

  data.customType.find({}, { name: 1, label: 1, icon: 1 }, (err, menus) => {
    res.locals.menus = menus
    next()
  })

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


/*** Generic routes ***/
router.get('/:customType', (req, res) => {
  console.log("Generique GET")

  var customType = req.params.customType

  data.customType.findOne({ name: customType }, (err, customType) => {

    var databaseName = customType.name

    data[databaseName].find({}, (err, posts) => {

      getFormatedPosts(posts, customType).then((posts) => {

        console.log("sending result to client")
        console.log(posts)
        res.render('admin/generic-page', { posts, customType })
      })
    })

  })

})

router.get('/:customType/edit/:postId', (req, res) => {
  var customType = req.params.customType
  var postId = req.params.postId

  data.customType.findOne({ name: customType }, (err, customType) => {

    var databaseName = customType.name

    data[databaseName].findOne({ _id: postId }, (err, post) => {

      getFormatedPost(post, customType, false).then((post) => {

        console.log("sending result to client")
        console.log(post)
        res.render('admin/generic-page-edit', { post, customType })
      })

    })

  })

})

async function getFormatedPost(post, customType, isTab) {

  var properties = customType.properties

  var formatedPost = {}

  for (var propKey in properties) {

    if (!isTab || customType.columns.includes(propKey)) {

      var propValues = properties[propKey]

      formatedPost[propKey] = {}

      formatedPost[propKey].properties = properties[propKey]
      formatedPost[propKey].value = post[propKey]

      var value = post[propKey]
      var type = propValues.type
      var autokey = propValues.autokey

      // if autokey for the tab
      if (autokey) {
        formatedPost[propKey].link = post._id
        formatedPost[propKey].value = post[propKey]
        formatedPost[propKey].path = customType.name

      } else {
        if (type == "relationship") {

          var relationship = await getRelationship(propValues, value)

          formatedPost[propKey].value = relationship.value
          formatedPost[propKey].link = relationship.link
          formatedPost[propKey].options = relationship.options

        } else {

        }

      }

    }

  }

  return formatedPost

}


async function getFormatedPosts(posts, customType) {
  for (var postKey in posts) {
    posts[postKey] = await getFormatedPost(posts[postKey], customType, true)
  }
  return posts
}

function getRelationship(propValues, postId) {
  return new Promise(resolve => {

    var path = propValues.path
    var refpath = propValues.refpath

    data[path].findOne({ _id: postId }, (err, postRelation) => {
      var value
      var link

      if (postRelation) {
        value = postRelation[refpath]
        link = postRelation._id
      } else {
        value = null
        link = null
      }

      data[path].find({}, (err, posts) => {

        var options = []

        for (var postKey in posts) {
          options[postKey] = { value: posts[postKey][refpath], id: posts[postKey]._id }
        }

        console.log("options relations builded ")
        console.log(options)

        resolve({ value, link, options })

      })
    })
  })
}


module.exports = router;