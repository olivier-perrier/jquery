console.log("Database managment loaded")

var Datastore = require('nedb')

var User = require('./User')

db = {}
db.users = new Datastore({ filename: 'data/users.nedb' })
db.resources = new Datastore({ filename: 'data/resources.nedb' })
db.defences = new Datastore({ filename: 'data/defences.nedb' })

db.users.loadDatabase()
db.resources.loadDatabase()
db.defences.loadDatabase()

db.model = function(modelName, modelFunction) {
    this.models.push(modelName, modelFunction)
}

db.model = function (modelName) {
    return models.find((elem) => {
        elem.name = modelName
        return elem.model
    }).model
}

var models = [
    { name: 'User', model: User },
]

module.exports = db
