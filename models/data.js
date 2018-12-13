console.log("Database managment loaded")

var Datastore = require('nedb')

db = {}
db.users = new Datastore({ filename: 'data/users.nedb' })
db.posts = new Datastore({ filename: 'data/posts.nedb' })
db.settings = new Datastore({ filename: 'data/settings.nedb' })

db.resources = new Datastore({ filename: 'data/resources.nedb' })
db.defences = new Datastore({ filename: 'data/defences.nedb' })

db.users.loadDatabase()
db.posts.loadDatabase()
db.settings.loadDatabase()

db.resources.loadDatabase()
db.defences.loadDatabase()

db.model = function(name){
    return require('./'+ name)
}

module.exports = db
