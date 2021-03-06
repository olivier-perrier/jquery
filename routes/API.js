var express = require("express");
var router = express.Router();

var data = require("../components/data.js");

// Router and api
var publicRouter = require('./public.js')
var authRouter = require('./auth.js')
var postRouter = require('./post.js')
var posttypeRouter = require('./posttype.js')

var apiMedia = require('./admin/medias.js')
var apiWebservice = require('./admin/webservices.js')

// Authorisations
// var authorizations = require('../components/authorizations')

// Logger for the routes requests
router.use((req, res, next) => {
  console.log("[DEBUG] " + req.method + " " + req.baseUrl + req.path);
  next();
});

router.use('/public', publicRouter);
router.use('/auth', authRouter);
router.use('/posttypes', posttypeRouter);
router.use('/post', postRouter);

router.use('/admin/medias', apiMedia);
router.use('/admin/webservices', apiWebservice);




//TODO autorisations
// router.all("*", authorizations.requireAuthentication)


/*** Current user ***/
router.get("/currentUser", (req, res) => {
  var userId = req.session.userId;
  data.users.findOne({ _id: userId }, (err, currentUser) => {
    if (currentUser)
      res.send({ message: "success : current user ", currentUser });
    else
      res.send({ message: "No user currently login " });
  });
});


/*** Admin menu ***/

router.get("/adminMenus", (req, res) => {
  var sort = req.query.sort

  data.customTypes.find({}).sort({ [sort]: 1 }).exec(function (err, menus) {
    res.send({ message: "success : menus found", menus });
  })

});



/*** DEBUG ***/

const fs = require('fs-extra')

router.post("/test", (req, res) => {

  data.settings.findOne({ name: "currentTemplate" }, (err, post) => {
    if (post) {
      var oldPath = "./templates/" + post.value
      var newPath = "./public"

      fs.copy(oldPath, newPath)
        .then(() => console.log('success!'))
        .catch(err => console.error(err))

      res.send()
    }
  })

});

router.get('/search', (req, res) => {
  res.send({ message: "TODO" })
})

module.exports = router;
