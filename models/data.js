console.log("Database managment loaded")

var Datastore = require('nedb')

db = {}
db.users = new Datastore({ filename: 'data/users.nedb' })
db.resources = new Datastore({ filename: 'data/resources.nedb' })
db.defences = new Datastore({ filename: 'data/defences.nedb' })

db.users.loadDatabase()
db.resources.loadDatabase()
db.defences.loadDatabase()

db.resourceModel = {
    name: "Resource",
    level: 1,
    quantity: 10,
    production: 1.1,
    cost: 250,
    userId: null,
    updatedAt: new Date(),
    createdAt: new Date()
}

db.UserSchema = {
    name: "Olivier",
    createdAt: new Date(),
    updatedAt: new Date()
}

db.User = db.users

// db.resources.remove({name: "Olivier"})
// db.resources.insert(db.resourceModel, (err, res) => { console.log(res) })
// db.users.insert(db.userModel, (err, res) => { console.log(res) })


module.exports = db
