var express = require('express');
var router = express.Router();

var publicController = require('../controllers/publicController')
var postController = require('../controllers/postController')

// Public menu of the site
router.get("/menus", publicController.getMenus)


/*** Posts ***/

//Get all posts
router.get("/post/:postTypeName", postController.index);

//Get a post by Id
router.get('/post/:postId', postController.getById)


module.exports = router;