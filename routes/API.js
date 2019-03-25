var express = require('express');
var router = express.Router();

var usersRouter = require('./users.js')

var data = require('../models/data.js')
var Post = data.model('Post')

router.use('/users', usersRouter);

router.use((req, res, next) => {
  next()
})

/*** Generic routes ***/

router.post('/:customType/upload', (req, res) => {
  var customType = req.params.customType

  console.log(req.files)

  let sampleFile = req.files.sampleFile;

  var imageName = sampleFile.name

  sampleFile.mv('./public/medias/' + sampleFile.name, function (err) {
    if (err) {
      console.log("[ERROR] moving uploaded file " + err)
      res.send({ message: "internal error : error moving the file " + sampleFile.name })

    } else {

      console.log("media moved")
      data[customType].update({}, { image: imageName }, (err, num) => {
        console.log("media updated " + num)

        if (num)
          res.send({ message: "success : media created " + sampleFile })
        else
          res.send({ message: "internal error : impossible to save create " + sampleFile })
      })

    }

  })

})

router.post('/:customType/create', (req, res) => {

  var customType = req.params.customType

  var post = req.body.post || {}
  post.authorId = req.session.userId
  post.createdAt = new Date()

  data.customType.findOne({ name: customType }, (err, customType) => {

    var databaseName = customType.name

    data[databaseName].insert(post, (err, post) => {
      if (post) {
        res.send({ message: "success : post created", post })
      } else {
        res.send({ message: "internal error : impossible to create post" })
      }
    })

  })

})

router.post('/:customType/save', (req, res) => {
  var customType = req.params.customType

  var postId = req.body.postId
  var post = req.body.post

  post.updatedAt = new Date()

  data.customType.findOne({ name: customType }, (err, customType) => {

    var databaseName = customType.name

    data[databaseName].update({ _id: postId }, { $set: post }, (err, num) => {
      if (num) {
        res.send({ message: "success : post updated" })
      } else {
        res.send({ message: "internal error : impossible to save post" })
      }
    })


  })



})

router.post('/:customType/delete', (req, res) => {
  var customType = req.params.customType

  var postId = req.body.postId

  data[customType].remove({ _id: postId }, (err, num) => {
    if (num) {
      res.send({ message: "success : post deleted" })
    } else {
      res.send({ message: "internal error : impossible to delete post" })
    }
  })

})

router.get('/:customType', (req, res) => {
  var customType = req.params.customType

  if (data[customType]) {

    data[customType].find({}, (err, posts) => {
      res.send({ message: "success : posts found", posts })
    })

  } else {
    res.send({ message: "not found : postType not existing " + customType })
  }

})

router.post('/:customType/trash', (req, res) => {
  var customType = req.params.customType
  var postId = req.body.postId

  data[customType].update({ _id: postId }, { $set: { status: "trash" } }, (err, num) => {
    if (num) {
      res.send({ message: "success : post removed " + num })
    } else {
      res.send({ message: "internal error : impossible to trash post" })
    }
  })

})

module.exports = router;