var data = require('./data')

var User = {
    username: String,
    role: String,
    email: String,
    password: String,
}

User.getUser = function getUser(userId, callback) {
    data.users.findOne({ _id: userId }, (err, user) => {
        callback(err, user)
    })
}

User.getUsers = function getUsers(usersId, callback) {
    data.users.find({ _id: { $in: usersId } }, (err, user) => {
        callback(err, user)
    })
}

User.createUser = function createUser(username, role, email, password, callback) {
    data.users.insert({
        username: username,
        role: role,
        email: email,
        password: password,
    }, (err, user) => {
        callback(err, user)
    })
}

User.updateUser = function updateUser(userId, username, role, email, password, callback) {
    data.users.update({ _id: userId },
        {
            username: username,
            role: role,
            email: email,
            password: password,
        }, (err, user) => {
            callback(err, user)
        })
}

User.deleteUser = function deleteUser(userId, callback) {
    data.users.remove({ _id: userId }, (err, num) => {
        callback(err, num)
    })
}

// User.createUser("Peter", "Peter", "peter@gmail.com", "admin", (err, doc) => {})

User.returnUser = function returnUser(username) {
    return { name: username }
}

module.exports = User