var data = require('./data.js')

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

Resource.update = function (userId) {
    data.resources.findOne({userId: userId}, (err, doc) => {

        if(doc == null) {
            return {message : "internal error : no resource found for user"}
        }else {

            var secondsElapsed = (new Date() - doc.updatedAt) / 1000
            var quantity = doc.quantity + (resource.production * secondsElapsed)

            data.resources.update({ userId: userId }, { $set: { quantity: quantity, updatedAt: new Date() } })
        }

    })

}

module.exports = Resource