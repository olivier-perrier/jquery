var express = require('express');
var router = express.Router();

var authController = require('../controllers/authController')

// var authorizations = require('../components/authorizations')
// router.all("*", authorizations.requireAuthentication)

// Logger for this router's requests
router.use((req, res, next) => {
    console.log("[DEBUG] " + req.method + " " + req.baseUrl + req.path)
    next();
})

router.post("/login", authController.login)

router.post("/logout", authController.logout)

router.post("/register", authController.register)


module.exports = router;