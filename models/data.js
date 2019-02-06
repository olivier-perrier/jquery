console.log("Database managment loaded")

var Datastore = require('nedb')

var op = require('./OP')

db = {}
db.users = new Datastore({ filename: 'data/users.nedb' })
db.posts = new Datastore({ filename: 'data/posts.nedb' })
db.settings = new Datastore({ filename: 'data/settings.nedb' })

db.users.loadDatabase()
db.posts.loadDatabase()
db.settings.loadDatabase()

db.model = function(name){
    return require('./'+ name)
}

module.exports = db
