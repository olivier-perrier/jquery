var express = require("express");
var router = express.Router();

var authRouter = require('./auth.js')
var postRouter = require('./post.js')


var data = require("../components/data.js");
var apiWebservice = require('./api/admin/webservices/webservices.js')

var authorizations = require('../components/authorizations')

router.use('/auth', authRouter);
router.use('/post', postRouter);

router.use('/admin/webservices', apiWebservice);

// Controllers
var postController = require('../controllers/postController')



router.use((req, res, next) => {
  console.log("[DEBUG] " + req.method + " " + req.baseUrl + req.path);
  next();
});

//TODO autorisations
router.all("*", authorizations.requireAuthentication)


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


/*** Posts ***/

//Get a custom type by name // TODO call the same function with ID 
router.get("/:postTypeName/name/:customTypeName", postController.getByName)

//Get all posts
router.get("/:postTypeName", postController.get);

//Create a post
router.post("/:postTypeName/create", postController.create);

//Get a post by Id
router.get('/:postTypeName/:postId', postController.getById)

// Update a post
router.put("/:postTypeName/:postId", postController.update)

// Delete a post
router.delete("/:postTypeName/:postId", postController.remove);


// TODO for image field
router.post("/:customTypes/upload", (req, res) => {
  var customType = req.params.customType;

  console.log(req.files);

  let sampleFile = req.files.sampleFile;

  var imageName = sampleFile.name;

  sampleFile.mv("./public/medias/" + sampleFile.name, function (err) {
    if (err) {
      console.log("[ERROR] moving uploaded file " + err);
      res.send({
        message: "internal error : error moving the file " + sampleFile.name
      });
    } else {
      console.log("media moved");
      data[customType].update({}, { image: imageName }, (err, num) => {
        console.log("media updated " + num);

        if (num) res.send({ message: "success : media created " + sampleFile });
        else
          res.send({
            message: "internal error : impossible to save create " + sampleFile
          });
      });
    }
  });
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
