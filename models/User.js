var data = require('./data')

var User = {
    username: String,
    name: String,
    email: String,
    role: String,
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

User.createUser = function createUser(username, name, email, role, callback) {
    data.users.insert({
        username: username,
        name: name,
        email: email,
        role: role,
    }, (err, user) => {
        callback(err, user)
    })
}

// User.createUser("Peter", "Peter", "peter@gmail.com", "admin", (err, doc) => {})

User.returnUser = function returnUser(username) {
    return { name: username }
}

module.exports = User