var data = require('./data')

class Defence {
    
    constructor(userId) {
        this.name = "Space ship";
        this.number = 0
        this.attack = 1
        this.defence = 2
        this.price = 10
        this.userId  = userId
    }
}

module.exports = Defence