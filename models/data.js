console.log("Database managment loaded")

var Datastore = require('nedb')

var User = require('./User')
var Resource = require('./Resource')
var Defence = require('./Defence')

db = {}
db.users = new Datastore({ filename: 'data/users.nedb' })
db.resources = new Datastore({ filename: 'data/resources.nedb' })
db.defences = new Datastore({ filename: 'data/defences.nedb' })

db.users.loadDatabase()
db.resources.loadDatabase()
db.defences.loadDatabase()

db.model = {
    User,
    Resource,
    Defence
}

module.exports = db
