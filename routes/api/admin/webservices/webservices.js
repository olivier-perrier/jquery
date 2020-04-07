var express = require("express");
var router = express.Router();

var data = require("../../../../models/data");


router.get("/:webServiceAdress", (req, res, next) => {
    var webServiceAdress = req.params.webServiceAdress

    console.log("webServiceAdress " + webServiceAdress)

    data.webservices.findOne({ adress: webServiceAdress }, (err, post) => {
        new Function("res", "req", post.function)(res, req)
    })

});

module.exports = router;
