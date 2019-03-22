var express = require('express');
var router = express.Router();

var usersRouter = require('./users.js')

var data = require('../models/data.js')
var Post = data.model('Post')

router.use('/users', usersRouter);

router.use((req, res, next) => {
  next()
})

/*** Medias ***/
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
      data.medias.update({}, { image: imageName }, (err, num) => {
        console.log("media updated " + num)

        if (num)
          res.send({ message: "success : media created " + sampleFile })
        else
          res.send({ message: "internal error : impossible to save create " + sampleFile })
      })

    }

  })

})

router.post('/medias/delete', (req, res) => {

  var postId = req.body.postId

  const fs = require('fs')

  data.medias.findOne({ _id: postId }, (err, media) => {

    if (media) {

      fs.unlink('./public/medias/' + media.name, (err) => {

        if (err) {
          console.log("[ERROR] no file to delete " + media.name + " err:" + err)

        } else {
          console.log("[SUCCESS] file deleted " + media.name)
        }
      })

    }else{
      console.log("[DEBUG] impssible to find media for id " + postId)

    }

  })

  data.medias.remove({ _id: postId }, (err, num) => {
    if (num) {
      res.send({ message: "success : media deleted" })
    } else {
      res.send({ message: "internal error : impossible to delete media for id " + postId })
    }
  })

})

/*** Generic routes ***/
router.post('/:customType/create', (req, res) => {

  var customType = req.params.customType

  var post = req.body.post || {}
  post.authorId = req.session.userId

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

  data.customType.findOne({ name: customType }, (err, customType) => {

    var databaseName = customType.name

    data[databaseName].remove({ _id: postId }, (err, num) => {
      if (num) {
        res.send({ message: "success : post deleted" })
      } else {
        res.send({ message: "internal error : impossible to delete post" })
      }
    })

  })

})

router.get('/:customType', (req, res) => {
  console.log("TODO : test")

  var customType = req.params.customType

  data.customType.findOne({ name: customType }, (err, customType) => {

    var databaseName = customType.name

    data[databaseName].find({}, (err, posts) => {
      res.send({ message: "success : posts found", posts })
    })
  })

})

router.post('/:customType/trash', (req, res) => {
  console.log("TODO : test")

  var customType = req.params.customType

  var postId = req.body.postId

  data.customType.findOne({ name: customType }, (err, customType) => {

    var databaseName = customType.name

    data[databaseName].update({ _id: postId }, { $set: { status: "trash" } }, (err, num) => {
      if (num) {
        res.send({ message: "success : post removed " + num })
      } else {
        res.send({ message: "internal error : impossible to trash post" })
      }
    })
  })

})

module.exports = router;