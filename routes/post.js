var express = require('express');
var router = express.Router();

var postController = require('../controllers/postController')

// var authorizations = require('../components/authorizations')
// router.all("*", authorizations.requireAuthentication)

// Logger for this router's requests
router.use((req, res, next) => {
    console.log("[DEBUG] " + req.method + " " + req.baseUrl + req.path)
    next();
})

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




module.exports = router;