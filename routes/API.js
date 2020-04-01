var express = require("express");
var router = express.Router();

var data = require("../models/data.js");

router.use((req, res, next) => {
  console.log("[DEBUG] " + req.method + " " + req.baseUrl + req.path);
  next();
});



// Admin requests
router.post("/admin/menus", (req, res) => {
  data.customTypes.find({}, { name: 1, label: 1, icon: 1 }).sort({ order: 1 }).exec((err, menus) => {
    res.send({ menus });
  })
});

router.post("/admin/models", (req, res) => {
  data.customTypes.find({}).sort({ order: 1 }).exec((err, models) => {
    res.send({ models })
  })
});

//DEBUG
router.post("/test", (req, res) => {
  if (req.session.test)
    req.session.test++
  else
    req.session.test = 1;
  console.log(req.session.test)
  res.send()
});

/*** Login ***/
router.post("/login", (req, res) => {
  var loginUser = req.body.user || {};

  data.users.findOne(
    { email: loginUser.email, password: loginUser.password },
    (err, user) => {
      if (user) {
        req.session.userId = user._id;
        req.session.userRole = user.role;
        req.session.userName = user.firstName;
        res.send({ message: "success : loggin ", user: user });
        console.log("[DEBUG] login user " + user._id)
      } else {
        res.send({ message: "not found : unknow username or password" });
        console.log("[DEBUG] login user not found " + loginUser.email + " " + loginUser.password)
      }
    }
  );
});

router.post("/logout", (req, res) => {
  req.session.userId = null;
  res.send({ message: "success : user logout" });
});

router.post("/signup", (req, res) => {
  var user = req.body.user;

  data.users.findOne({ name: user.userName }, (err, user) => {
    if (user) {
      res.send({ message: "forbidden : user not available" });
    } else {
      data.users.insert(user, (err, user) => {
        res.send({ message: "success : user created", user: user });
      });
    }
  });
});

// Send the current login user
router.get("/currentUser", (req, res) => {
  console.log("/currentUser " + req.session.userId)
  var userId = req.session.userId;
  data.users.findOne({ _id: userId }, (err, currentUser) => {
    if (currentUser)
      res.send({ message: "success : current user ", currentUser });
    else
      res.send({ message: "No user currently login " });
    console.log("curent user sent ")
    console.log(currentUser)
  });
});

/*** new API for Vuejs */

/*** Menus
 * Les menus d'aministration sont la liste des types paramétrés
 */

//Get list of menus
router.get("/menus", (req, res) => {

  data.customTypes.find({}).sort({ order: 1 }).exec(function (err, menus) {
    res.send({ message: "success : menus found", menus });
  })

});



/*** Custom types ***/

//Get a custom type
router.get("/customTypes/:customTypeId", (req, res) => {
  var customTypeId = req.params.customTypeId;

  data.customTypes.findOne({ _id: customTypeId }, (err, post) => {
    if (post) {
      res.send({ message: "success : custom type found", post });
    } else {
      res.send({ message: "not found : custom type not existing for id " + customTypeId });
    }
  });

});

//Get a custom type by name // TODO call the same function with ID 
router.get("/customTypes/name/:customTypeName", (req, res) => {
  var customTypeName = req.params.customTypeName;

  data.customTypes.findOne({ name: customTypeName }, (err, post) => {
    if (post) {

      //Parse the settings
      try {
        post.setting = JSON.parse(post.setting);
      } catch (error) {
        console.log("[WARNING] impossible to parse JSON " + post.setting)
      }

      //Disable the updated and created fields
      if (post.setting) {
        try {
          post.setting.find(e => e.name == "updatedAt").disabled = true
          post.setting.find(e => e.name == "createdAt").disabled = true
        } catch (error) {
          console.log("[WARNING] impossible disable updated and created setting ")
        }
      }

      res.send({ message: "success : custom type found", post });
    } else {
      res.send({ message: "not found : custom type not existing for name " + customTypeName });
    }
  });

});

//Get list of custom types
router.get("/customTypes", (req, res) => {

  data.customTypes.find({}).sort({ order: 1 }).exec((err, customTypes) => {
    res.send({ message: "success : custom types found", customTypes });
  })

});

//Delete a custom Type
router.post("/customTypes/delete", (req, res) => {

  var postId = req.body.postId;

  data.customTypes.remove({ _id: postId }, (err, num) => {
    if (num) {
      res.send({ message: "success : custom type deleted" });
    } else {
      res.send({ message: "not found : impossible to delete custom type" });
    }
    console.log("[DEBUG] custom type post (customTypes) deleted " + postId + " " + num)
  });
});

/*** Posts ***/

//Get a post
router.get('/:customTypeName/:postId', (req, res, next) => {
  var customTypeName = req.params.customTypeName
  var postId = req.params.postId

  data[customTypeName].findOne({ _id: postId }, (err, post) => {
    res.send({ message: "success : post found", post })
  })

})

//Get all posts
router.get("/:customTypeName", (req, res) => {
  var customTypeName = req.params.customTypeName;

  if (data[customTypeName]) {
    data[customTypeName].find({}, (err, posts) => {
      res.send({ message: "success : posts found", posts });
      console.log("[DEBUG] posts (" + customTypeName + ") found " + posts.length)
    });
  } else {
    res.send({ message: "not found : postType not existing " + customTypeName });
  }
});

//Create a post
router.post("/:postTypeName/create", (req, res) => {
  var postTypeName = req.params.postTypeName;
  var newPost = req.body.customType;

  newPost = newPost || {}

  newPost.createdAt = new Date();

  data[postTypeName].insert(newPost, (err, post) => {
    if (post) {
      res.send({ message: "success : post created", post });
    } else {
      res.send({ message: "database error : impossible to create post" });
    }
    console.log("[DEBUG] post (" + postTypeName + ") created " + post._id)
  });
});

//Save a post
router.post("/:postTypeName/save", (req, res) => {
  var postTypeName = req.params.postTypeName;
  var newPost = req.body.post
  var postId = req.body.postId

  newPost = newPost || {}
  newPost.updatedAt = new Date()

  data[postTypeName].update({ _id: postId }, { $set: newPost },
    (err, num) => {
      if (num)
        res.send({ message: "success : post saved" });
      else
        res.send({ message: "database error : impossible to save post" });
      console.log("[DEBUG] post (" + postTypeName + ") saved " + num)
    });

});

//TODO n'est plus utilisé 
router.post("/:customTypes/create", (req, res) => {
  var customType = req.params.customType;

  var post = req.body.post || {};
  post.authorId = req.session.userId;
  post.createdAt = new Date();

  data.customTypes.findOne({ name: customType }, (err, customType) => {
    var databaseName = customType.name;

    data[databaseName].insert(post, (err, post) => {
      if (post) {
        res.send({ message: "success : post created", post });
      } else {
        res.send({ message: "internal error : impossible to create post" });
      }
    });
  });
});


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

//TODO n'est plus utilisé
router.post("/:customTypes/save", (req, res) => {
  var customType = req.params.customType;

  var postId = req.body.postId;
  var post = req.body.post;

  post.updatedAt = new Date();

  data.customType.findOne({ name: customType }, (err, customType) => {
    var databaseName = customType.name;

    data[databaseName].update({ _id: postId }, { $set: post }, (err, num) => {
      if (num) {
        res.send({ message: "success : post updated" });
      } else {
        res.send({ message: "internal error : impossible to save post" });
      }
    });
  });
});

//Delete a post
router.post("/:customTypes/delete", (req, res) => {
  var customType = req.params.customType;

  var postId = req.body.postId;

  data[customType].remove({ _id: postId }, (err, num) => {
    if (num) {
      res.send({ message: "success : post deleted" + num });
    } else {
      res.send({ message: "internal error : impossible to delete post" });
    }
    console.log("[DEBUG] post (" + customType + ") deleted " + num)
  });
});

router.post("/:customTypes/trash", (req, res) => {
  var customType = req.params.customType;
  var postId = req.body.postId;

  data[customType].update(
    { _id: postId },
    { $set: { status: "trash" } },
    (err, num) => {
      if (num) {
        res.send({ message: "success : post removed " + num });
      } else {
        res.send({ message: "internal error : impossible to trash post" });
      }
    }
  );
});

module.exports = router;
