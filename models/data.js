
console.log("Database managment loading...")

var Datastore = require('nedb')

db = {}
db.users = new Datastore({ filename: 'data/users.nedb' })
db.posts = new Datastore({ filename: 'data/posts.nedb' })
// db.pages = new Datastore({ filename: 'data/pages.nedb' })
// db.comments = new Datastore({ filename: 'data/comments.nedb' })
db.settings = new Datastore({ filename: 'data/settings.nedb' })

db.users.loadDatabase()
db.posts.loadDatabase()
// db.pages.loadDatabase()
// db.comments.loadDatabase()
db.settings.loadDatabase()

db.model = function (name) {
    return require('./' + name)
}

db.createDatastores = function (names) {
    console.log("Database creation ")
    for (var name of names) {
        db[name] = new Datastore({ filename: 'data/' + name + '.nedb' })
    }
}

db.loadDatabases = function (names) {
    for (var name of names) {
        db[name].loadDatabase()
    }
}

module.exports = db
