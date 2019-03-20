
console.log("Database managment loading...")

var Datastore = require('nedb')

db = {}
db.customType = new Datastore({ filename: 'data/customtype.nedb' })
db.users = new Datastore({ filename: 'data/users.nedb' })
db.posts = new Datastore({ filename: 'data/posts.nedb' })
db.settings = new Datastore({ filename: 'data/settings.nedb' })

db.customType.loadDatabase(err => {
    loadDataStores()
})


db.users.loadDatabase()
db.posts.loadDatabase()
db.settings.loadDatabase()

function loadDataStores() {
    console.log("Loading datastores")
    db.customType.find({}, { name: 1 }, (err, databases) => {
        for (var database of databases) {
            console.log("creating datastore name " + database.name)
            db[database.name] = new Datastore({ filename: 'data/' + database.name +'.nedb' })
            console.log("loading database name " + database.name)
            db[database.name].loadDatabase()
        }
    })
}


db.model = function (name) {
    return require('./' + name)
}

module.exports = db
