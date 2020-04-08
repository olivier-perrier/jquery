var Datastore = require('nedb')

db = {
    isLoaded: false,
    loadDatabases: loadDatabases
}

function loadDatabases(callback) {
    console.log("[DEBUG] Loading database")

    // Charge la base de données principale
    db.customTypes = new Datastore({ filename: 'data/customtypes.nedb', autoload: true })

    // Charge les bases de données des types paramétres
    db.customTypes.find({}, { name: 1 }, (err, databases) => {
        for (var database of databases) {
            db[database.name] = new Datastore({ filename: 'data/' + database.name + '.nedb' })
            db[database.name].loadDatabase()
            // console.log("Database loaded " + database.name)
        }

        isLoaded = true
        console.log("[DEBUG] Database loaded")


        if (callback)
            callback()
    })
}

module.exports = db
