var Datastore = require('nedb')

db = {
    isLoaded: false,
    loadDatabases: loadDatabases
}

function loadDatabases() {
    console.log("[DEBUG] Loading database")

    db.customTypes = new Datastore({ filename: 'data/customtypes.nedb', autoload: true })

    db._posts = new Datastore({ filename: 'data/_posts.nedb', autoload: true })

    db.users = new Datastore({ filename: 'data/users.nedb', autoload: true })
    
    db.requests = new Datastore({ filename: 'data/requests.nedb', autoload: true })
}

module.exports = db
