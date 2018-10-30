var data = require('./data')

var UserSchema = {
    name: "Olivier",
    createdAt: new Date(),
    updatedAt: new Date(),

}

class User {

    // this.findById = function(userId) {
    //     data.users.findOne(userId, (err, doc) => { return doc }).then((doc) => { return doc })
    //     return { name: 'Olivier' }
    // }

    findById(userId) {
        return "found"
    }
}



module.exports = User