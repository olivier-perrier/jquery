var express = require('express');
var router = express.Router();

var opkey = require('../models/opkey')
var opkey = new opkey()

var data = require('../models/data.js')
var Post = data.model('Post')
var Page = data.model('Page')
var User = data.model('User')
var Comment = data.model('Comment')
var Setting = data.model('Setting')

router.all("*", (req, res, next) => {
  next()
})

router.use((req, res, next) => {

  data.customType.find({}, { name: 1, label: 1 }, (err, menus) => {
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

function addRelationshhip(){
  // todo
}

function setProperties(post, properties, customType) {

  for (var prop of properties) {
    var propKey = Object.keys(prop)
    console.log("current prop : " + propKey)
    console.log(prop[propKey])

    var name = propKey
    var label = propKey
    var postValue = post[propKey]
    var link = ""
    var type = prop[propKey].type
    var autokey = prop[propKey].autokey

    // if autokey for the tab
    if (prop[propKey].autokey) {
      var link = post[propKey]
      var path = customType.name
      console.log("path " + customType.name)
    } else {
      if (prop[propKey].type == "relationship") {

        var path = prop[propKey].path
        var refpath = prop[propKey].refpath

        data[path].findOne({ _id: postValue }, (err, postRelation) => {

          postValue = postRelation[refpath]
          link = postRelation._id
        })

      } else {

      }


    }

    post[propKey] = {
      name: name,
      label: label,
      value: postValue,
      link: link,
      type: type,
      autokey: autokey,
      path: path,
    }
  }
}


/*** Generic routes ***/
router.get('/:customType', (req, res) => {
  console.log("Generique GET")

  var customType = req.params.customType

  data.customType.findOne({ name: customType }, (err, customType) => {

    var databaseName = customType.name

    data[databaseName].find({}, (err, posts) => {

      var properties = customType.properties

      for (var post of posts) {
        setProperties(post, properties, customType)
      }

      console.log(posts)
      res.render('admin/generic-page', { posts })
    })

  })

})

router.get('/:customType/edit/:postId', (req, res) => {
  var customType = req.params.customType

  var postId = req.params.postId

  data.customType.findOne({ name: customType }, (err, customType) => {

    var databaseName = customType.name

    data[databaseName].findOne({ _id: postId }, (err, post) => {

      var properties = customType.properties

      setProperties(post, properties, customType)

      console.log(post)
      res.render('admin/generic-page-edit', { post })

    })

  })

})

function sendGenericPosts(res, model) {
  var properties = model.getProperties()

  console.log("request database")

  data[properties.name].find({}, model.getProjection(), (err, posts) => {
    console.log("database requested")

    model.getBuildPosts(posts).then((result) => {
      console.log(result)
      res.render('admin/comments', { schema: model.schema, posts: result, columns: model.getColumnsTitles(), properties: model.properties })
    })
    console.log("after then")
  })
}

function sendGenericPost(res, model, postId) {
  var properties = model.getProperties()

  data[properties.name].findOne({ _id: postId }, (err, post) => {

    model.getBuildPost(post).then(result => {
      // console.log(result)
      res.render('admin/comments-edit', { post: result, properties: properties })
    })
  })
}


module.exports = router;