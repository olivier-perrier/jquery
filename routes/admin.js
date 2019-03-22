var express = require('express');
var router = express.Router();

var data = require('../models/data.js')

router.all("*", (req, res, next) => {
  next()
})

router.use((req, res, next) => {

  data.customType.find({}, { name: 1, label: 1, icon: 1 }).sort({ order: 1 }).exec((err, menus) => {
    res.locals.menus = menus
    next()
  })

})

router.get('/', (req, res) => {

  data.customType.find({}).sort({ order: 1 }).exec((err, models) => {
    res.render('admin/index', { models })

  })

})


/*** Generic routes ***/
router.get('/:customType', (req, res) => {
  var customTypeName = req.params.customType

  data.customType.findOne({ name: customTypeName }, (err, customType) => {

    if (customType) {

      var databaseName = customType.name

      // Set labels to CustomType properties
      customType.columnsName = []
      for (var prop in customType.columns) {
        customType.columnsName.push(jsUcfirst(customType.columns[prop]))
      }

      data[databaseName].find({}, (err, posts) => {

        getFormatedPosts(posts, customType).then((posts) => {

          console.log("sending result to client")
          console.log(posts)
          res.render('admin/generic-page', { posts, customType })
        })
      })

    } else {
      console.log("[WARNING] not custom type for " + customTypeName)
      res.redirect('/admin')

    }
  })

})

router.get('/:customType/edit/:postId', (req, res) => {
  var customTypeName = req.params.customType
  var postId = req.params.postId

  data.customType.findOne({ name: customTypeName }, (err, customType) => {

    var databaseName = customType.name

    data[databaseName].findOne({ _id: postId }, (err, post) => {

      if (post) {

        getFormatedPost(post, customType, false).then((post) => {
          console.log("sending result to client")
          console.log(post)
          res.render('admin/generic-page-edit', { post, customType })
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

  for (var propKey in properties) {

    if (!isTab || customType.columns.includes(propKey) || propKey == "_id") {

      var propValues = properties[propKey]

      formatedPost[propKey] = {}

      formatedPost[propKey].properties = properties[propKey]
      formatedPost[propKey].value = post[propKey]

      var value = post[propKey]
      var type = propValues.type

      if (type == "autokey") {
        formatedPost[propKey].value = post[propKey]
        formatedPost[propKey].link = post._id
        formatedPost[propKey].path = customType.name

      } else if (type == "relationship") {

        var relationship = await getRelationship(propValues, value)

        formatedPost[propKey].value = relationship.value
        formatedPost[propKey].link = relationship.link
        formatedPost[propKey].options = relationship.options

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

        console.log("options relations builded ")
        console.log(options)

        resolve({ value, link, options })

      })
    })
  })
}

function jsUcfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


module.exports = router;