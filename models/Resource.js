var data = require('./data')

// function Resource(userId) {

//     this.name = "Resource"
//     this.level = 1
//     this.quantity = 10
//     this.production = 1.1 * this.level
//     this.cost = 250 * this.level
//     this.userId = userId
//     this.updatedAt = new Date()
//     this.createdAt = new Date()

//     this.updateQuantity = function () {
//         var secondsElapsed = (new Date() - this.updatedAt) / 1000
//         this.updatedAt = new Date()
//         this.quantity += (this.production * secondsElapsed)
//     }
// }

var Resource = {
    name: "Resource",
    level: 1,
    quantity: 10,
    production: 1.1,
    cost: 250,
    userId: null,
    updatedAt: new Date(),
    createdAt: new Date(),
}

Resource.update = function (resource) {
    var secondsElapsed = (new Date() - resource.updatedAt) / 1000
    resource.updatedAt = new Date()
    resource.quantity += (resource.production * secondsElapsed)

}

module.exports = Resource