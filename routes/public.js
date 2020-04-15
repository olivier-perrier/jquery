var express = require('express');
var router = express.Router();

var publicController = require('../controllers/publicController')
var postController = require('../controllers/postController')

// Public menu of the site
router.get("/menus", publicController.getMenus)


/*** Posts ***/

//Get a custom type by name // TODO call the same function with ID 
router.get("/post/:postTypeName/name/:customTypeName", postController.getByName)

//Get all posts
router.get("/post/:postTypeName", postController.get);

//Get a post by Id
router.get('/post/:postTypeName/:postId', postController.getById)


module.exports = router;