var express = require("express");
var router = express.Router();

var mediaController = require('../../controllers/mediaController')


router.post("/medias/upload", mediaController.upload)

module.exports = router
