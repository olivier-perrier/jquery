var data = require('./data')

var User = {
    name: String,
}

User.getUser = function getUser(userId, callback) {
    data.users.findOne({ _id: userId }, (err, doc) => {
        if (doc) {
            // console.log("[INFO] user found for _id " + userId)
            callback(doc)
        } else {
            // console.log("[WARNING] no user found for _id " + userId)
            callback(doc)
        }
    })
}

// data.users.insert({name: "Olivier"})

User.returnUser = function returnUser(username) {
    return {name : username}
}

module.exports = User