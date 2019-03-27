var express = require('express');
var router = express.Router();

var data = require('../models/data.js')

var authorizations = require('../components/authorizations')

router.all("*", (req, res, next) => {
  next()
})

// Authorizations
router.all("*", authorizations.requireAuthentication)

// Admin menus
router.use((req, res, next) => {
  data.customType.find({}, { name: 1, label: 1, icon: 1 }).sort({ order: 1 }).exec((err, menus) => {
    res.locals.menus = menus
    next()
  })
})

// Admin Index
router.get('/', (req, res) => {
  data.customType.find({}).sort({ order: 1 }).exec((err, models) => {
    res.render('admin/index', { models })
  })
})


/*** Generic routes ***/
router.get('/:model', (req, res) => {
  var modelName = req.params.model

  data.customType.findOne({ name: modelName }, (err, model) => {

    if (model) {

      data[modelName].find({}, (err, posts) => {

        getFormatedPosts(posts, model).then((posts) => {

          console.log(posts)
          res.render('admin/posts', { posts, model })

        })
      })

    } else {
      console.log("[WARNING] not custom type for " + customTypeName)
      res.redirect('/admin')

    }
  })

})

router.get('/:model/edit/:postId', (req, res) => {
  var modelName = req.params.model
  var postId = req.params.postId

  data.customType.findOne({ name: modelName }, (err, model) => {

    data[modelName].findOne({ _id: postId }, (err, post) => {

      if (post) {

        getFormatedPost(post, model, false).then((post) => {
          console.log("sending result to client")
          console.log(post)
          res.render('admin/posts-edit', { post, model })
        })
      } else {
        console.log("[DEBUG] not post found for id " + postId)
        res.send('not found')
      }

    })

  })

})

async function getFormatedPost(post, customType, isTab) {

  var properties = customType.properties

  var formatedPost = {}

  formatedPost._id = post._id

  formatedPost.fields = {}

  for (var propKey in properties) {

    if (!isTab || customType.columns.includes(propKey)) {

      formatedPost.fields[propKey] = {}

      // Add the properties to the objet field
      formatedPost.fields[propKey].properties = properties[propKey]

      // Add the default value of the field
      formatedPost.fields[propKey].value = post[propKey]
      formatedPost.fields[propKey].disabled = properties[propKey].protected ? "disabled" : ""


      var type = properties[propKey].type

      if (properties[propKey].autokey) {
        formatedPost.fields[propKey].value = post[propKey]
        formatedPost.fields[propKey].link = post._id
        formatedPost.fields[propKey].path = customType.name
      }

      if (type == "relationship") {

        var relationship = await getRelationship(properties[propKey], post[propKey])

        formatedPost.fields[propKey].value = relationship.value
        formatedPost.fields[propKey].link = relationship.link
        formatedPost.fields[propKey].options = relationship.options

      } else {

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

        resolve({ value, link, options })

      })
    })
  })
}

function jsUcfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


module.exports = router;