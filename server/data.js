console.log("Database managment loaded")

var Datastore = require('nedb')

db = {}
db.users = new Datastore({ filename: 'data/users.nedb' })
db.resources = new Datastore({ filename: 'data/resources.nedb' })

module.exports = db

db.users.loadDatabase()
db.resources.loadDatabase()

db.resourceModel = {
    name: "Olivier",
    level: 1,
    quantity: 10,
    production: 1.1,
    cost: 25,
    userId: null,
    updatedAt: new Date(),
    createdAt: new Date()
}

db.userModel = {
    name: "Olivier"
}

// db.resources.remove({name: "Olivier"})
// db.resources.insert(db.resourceModel, (err, res) => { console.log(res) })
// db.users.insert(db.userModel, (err, res) => { console.log(res) })