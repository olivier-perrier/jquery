var express = require('express');
var router = express.Router();

var postTypeController = require('../controllers/postTypeController')
var authorizations = require('../components/authorizations')


router.all("*", authorizations.requireAuthentication)

// /API/posttypes

router.get("/", postTypeController.index)

router.get("/:postTypeId", postTypeController.show)

router.get("/:postTypeId/posts", postTypeController.indexPost)

// Create a post type
router.post("/create", postTypeController.create);

// Update a post
router.put("/:postTypeId", postTypeController.store)

// Delete a post
router.delete("/:postTypeId", postTypeController.remove);



module.exports = router;