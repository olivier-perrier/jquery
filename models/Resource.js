var data = require('./data')

function Resource(userId) {

    this.name = "Resource"
    this.level = 1
    this.quantity = 10
    this.production = 1.1 * this.level
    this.cost = 250 * this.level
    this.userId = userId
    this.updatedAt = new Date()
    this.createdAt = new Date()

    this.update = function () {
        var secondsElapsed = (new Date() - this.updatedAt) / 1000
        this.updatedAt = new Date()
        this.quantity += (this.production * secondsElapsed)
    }
}

module.exports = Resource