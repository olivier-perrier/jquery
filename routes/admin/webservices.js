var express = require("express");
var router = express.Router();

var data = require("../../components/data");

// Création d'une api qui recois les connexions web services de l'exterieur
router.get("/:webServiceAdress", (req, res, next) => {
    var webServiceAdress = req.params.webServiceAdress

    console.log("[DEBUG] Web Service call " + webServiceAdress)

    data.webservices.findOne({ adress: webServiceAdress }, (err, post) => {
        new Function("res", "req", post.function)(res, req)
    })

});


module.exports = router;
