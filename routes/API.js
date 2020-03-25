var express = require("express");
var router = express.Router();

var data = require("../models/data.js");

router.use((req, res, next) => {
  console.log("[DEBUG] " + req.method + " " + req.baseUrl + req.path);
  next();
});

// Users
router.get("/user", (req, res) => {
  data.users.findOne({ name: "Olivier" }, (err, user) => {
    res.send({ message: "success : user ", user });
  });
});

// Admin requests
router.post("/admin/menus", (req, res) => {
  data.customType.find({}, { name: 1, label: 1, icon: 1 }).sort({ order: 1 }).exec((err, menus) => {
    res.send({ menus });
  })
});

router.post("/admin/models", (req, res) => {
  data.customType.find({}).sort({ order: 1 }).exec((err, models) => {
    res.send({ models })
  })
});


router.post("/login", (req, res) => {
  var username = req.body.name;
  var password = req.body.password;

  data.users.findOne(
    { username: username, password: password },
    (err, user) => {
      if (user) {
        req.session.userId = user._id;
        req.session.userRole = user.role;
        res.send({ message: "success : loggin ", user: user });
      } else {
        res.send({ message: "not found : unknow username or password" });
      }
    }
  );
});

router.post("/logout", (req, res) => {
  req.session.userId = null;
  res.redirect("/");
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

/*** new API for Vuejs */

/*** Menus
 * Les menus d'aministration sont la liste des types paramétrés
 */

//Get list of menus
router.get("/menus", (req, res) => {

  data.customType.find({}, (err, menus) => {
    res.send({ message: "success : menus found", menus });
  })

});


/*** Custom type */

//Get a custom type
router.get("/customType/:customTypeId", (req, res) => {
  var customTypeId = req.params.customTypeId;

  data.customType.findOne({ _id: customTypeId }, (err, post) => {
    if (post) {
      res.send({ message: "success : custom type found", post });
    } else {
      res.send({ message: "not found : custom type not existing for id " + customTypeId });
    }
  });

});

//Get a custom type by name
router.get("/customType/name/:customTypeName", (req, res) => {
  var customTypeName = req.params.customTypeName;

  data.customType.findOne({ name: customTypeName }, (err, post) => {
    if (post) {
      res.send({ message: "success : custom type found", post });
    } else {
      res.send({ message: "not found : custom type not existing for id " + customTypeName });
    }
  });

});

//Create a custom Type
router.post("/:customType/create", (req, res) => {
  var customType = req.body.customType;

  customType = customType || {}

  customType.name = "New custom type";
  customType.authorId = "TODO";
  customType.createdAt = new Date();

  data.customType.insert(customType, (err, post) => {
    if (post) {
      res.send({ message: "success : custome type created", post });
    } else {
      res.send({ message: "database error : impossible to create custom type" });
    }
  });
});

//Save a Custome Type
router.post("/customType/save", (req, res) => {
  var _id = req.body._id;
  var name = req.body.name;
  var setting = req.body.setting;
  var updatedAt = new Date()

  data.customType.update({_id: _id},
    { $set : {
      name: name,
      setting: setting,
      updatedAt: updatedAt }
    },
    (err, num) => {
      console.log("[DEBUG] custum type " + name + " created " + num)
      res.send({ message: "success : custom type created " });
    });

});

//Get list of custom types
router.get("/customTypes", (req, res) => {

  data.customType.find({}, (err, customTypes) => {
    res.send({ message: "success : custom types found", customTypes });
  })

});

//Delete a custom Type
router.post("/customType/delete", (req, res) => {

  var customTypeId = req.body.customTypeId;

  data.customType.remove({ _id: customTypeId }, (err, num) => {
    if (num) {
      res.send({ message: "success : custom type deleted" });
    } else {
      res.send({ message: "not found : impossible to delete custom type" });
    }
  });
});

/*** Generic routes ***/
router.post("/:customType/upload", (req, res) => {
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

router.post("/:customType/create", (req, res) => {
  var customType = req.params.customType;

  var post = req.body.post || {};
  post.authorId = req.session.userId;
  post.createdAt = new Date();

  data.customType.findOne({ name: customType }, (err, customType) => {
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

router.post("/:customType/save", (req, res) => {
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

router.post("/:customType/delete", (req, res) => {
  var customType = req.params.customType;

  var postId = req.body.postId;

  data[customType].remove({ _id: postId }, (err, num) => {
    if (num) {
      res.send({ message: "success : post deleted" });
    } else {
      res.send({ message: "internal error : impossible to delete post" });
    }
  });
});

router.get("/:customType", (req, res) => {
  var customType = req.params.customType;

  if (data[customType]) {
    data[customType].find({}, (err, posts) => {
      res.send({ message: "success : posts found", posts });
    });
  } else {
    res.send({ message: "not found : postType not existing " + customType });
  }
});

router.post("/:customType/trash", (req, res) => {
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
