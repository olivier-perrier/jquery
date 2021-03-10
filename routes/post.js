var express = require('express');
var router = express.Router();

var postController = require('../controllers/postController')
var authorizations = require('../components/authorizations')


router.all("*", authorizations.requireAuthentication)

//Get a post by Id
router.get('/', postController.index)

//Create a post
router.post("/create", postController.create);

//Get a post by Id
router.get('/:postId', postController.getById)

// Update a post
router.put("/:postId", postController.store)

// Delete a post
router.delete("/:postId", postController.remove);




module.exports = router;