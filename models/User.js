var data = require('./data')

var User = {

    userSchema: {
        username: String,
        role: String,
        email: String,
        password: String,
    }
}


function getUser(userId, callback) {
    data.users.findOne({ _id: userId }, (err, user) => {
        callback(err, user)
    })
}

function getByName(username, callback) {
    data.users.findOne({ username: username }, (err, user) => {
        callback(err, user)
    })
}

function getUsers(usersId, callback) {
    data.users.find({ _id: { $in: usersId } }, (err, user) => {
        callback(err, user)
    })
}

function getAll(callback) {
    data.users.find({}, (err, user) => {
        callback(err, user)
    })
}


function create(user, callback) {

    schemaCleaning(user)

    // Add missed property from the schema
    for (var key in User.userSchema) {
        if (!user[key]) {
            user[key] = ""
        }
    }

    // Add creation date
    user.createdAt = new Date()

    getByName(user.username, (err, doc) => {
        if (doc)
            callback("user name already exist", null)
        else
            data.users.insert(user, (err, doc) => {
                callback(err, doc)
            })
    })


}

function update(id, user, callback) {

    schemaCleaning(user)

    data.users.update({ _id: id }, { $set: user }, (err, user) => {
        callback(err, user)
    })
}

function remove(userId, callback) {
    data.users.remove({ _id: userId }, (err, num) => {
        callback(err, num)
    })
}

/*** Joins ***/
function getJoinedUser(doc, callback) {
    if (doc)
        var authorId = doc.authorId

    getUser(authorId, (err, user) => {
        if (user)
            doc.authorUsername = user.username

        callback(err, doc)
    })
}

function getJoinedUsers(docs, callback) {
    var authorIds = docs.map(doc => doc.authorId)

    getUsers(authorIds, (err, users) => {

        docs.forEach((doc, i) => {

            var currentUser = users.find(user => {
                return docs[i].authorId == user._id
            })

            if (currentUser)
                docs[i].authorUsername = currentUser.username

        })

        callback(err, docs)
    })
}

/*** Schema ***/
function schemaCleaning(user) {
    // Remove property that are not into the schema
    for (var key in user) {
        if (!User.userSchema[key]) {
            console.warn("[WARNING] property '" + key + "' do not existe in the user schema")
            delete user[key]
        }
    }
}

User.create = create
User.update = update
User.remove = remove
User.getUser = getUser
User.getUsers = getUsers
User.getByName = getByName

User.getJoinedUser = getJoinedUser
User.getJoinedUsers = getJoinedUsers

module.exports = User