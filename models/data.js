
console.log("Database managment loading...")

var Datastore = require('nedb')

db = {}

db.customType = new Datastore({ filename: 'data/customtype.nedb' })


db.customType.loadDatabase(err => {

    console.log("Loading datastores")
    db.customType.find({}, { name: 1 }, (err, databases) => { 
        for (var database of databases) {
            db[database.name] = new Datastore({ filename: 'data/' + database.name + '.nedb' })
            db[database.name].loadDatabase()
        }

        var installation = require('../components/installation')
        installation.createDatas()

    })
})

db.posts = new Datastore({ filename: 'data/posts.nedb' })
db.settings = new Datastore({ filename: 'data/settings.nedb' })
db.posts.loadDatabase()
db.settings.loadDatabase()


db.model = function (name) {
    return require('./' + name)
}

module.exports = db
