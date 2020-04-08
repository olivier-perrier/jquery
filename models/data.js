
console.log("Database managment loading...")

var Datastore = require('nedb')

var installation = require('../components/installation')

db = {
	isLoaded : false
}

// Charge la base de données principale
db.customTypes = new Datastore({ filename: 'data/customtypes.nedb', autoload: true })

// installation.createModels()

// Charge les bases de données des types paramétres
db.customTypes.find({}, { name: 1 }, (err, databases) => {
    for (var database of databases) {
        db[database.name] = new Datastore({ filename: 'data/' + database.name + '.nedb' })
        db[database.name].loadDatabase()
		console.log("Database loaded " + database.name)
    }

	isLoaded = true
    console.log("Database loaded")


    // Crée des exemples de données
    // installation.createDatas()

})


// db.model = function (name) {
//     return require('./' + name)
// }

module.exports = db
