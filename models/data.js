
console.log("Database managment loading...")

var Datastore = require('nedb')

db = {}
db.customType = new Datastore({ filename: 'data/customtype.nedb' })
db.users = new Datastore({ filename: 'data/users.nedb' })
db.posts = new Datastore({ filename: 'data/posts.nedb' })
// db.pages = new Datastore({ filename: 'data/pages.nedb' })
db.settings = new Datastore({ filename: 'data/settings.nedb' })

db.customType.loadDatabase(err => {
    loadDataStores()

})
db.users.loadDatabase()
db.posts.loadDatabase()
// db.pages.loadDatabase()
db.settings.loadDatabase()

function loadDataStores() {
    console.log("Loading datastores")
    db.customType.find({}, { name: 1 }, (err, databases) => {
        for (var database of databases) {
            console.log("loading database name " + database.name)
            db[database.name].loadDatabase()
        }
    })
}


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
