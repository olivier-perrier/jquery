

var data = require('../models/data')
var User = data.model('User')

exports.load = load

function load (app) {
    console.log("Loading Component")

    // Define my routes

    app.get("/test", (req, res, next) => {
        console.log("Component app")
    
        User.getByName("Olivier", (err, user) => {
            res.send("component test success " + user.username)
        })
    })
}