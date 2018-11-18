var express = require('express');
var router = express.Router();

var data = require('../models/data.js')
var Post = data.model('Post')

router.get('/', (req, res) => {
  console.log("POST /posts")

  data.posts.find({}, (err, docs) => {
    if (docs == null) {
      res.send({ message: "not found : no posts found" })
    } else {
      res.send({ message: "success found posts", posts: docs })
    }
  })

})

module.exports = router;