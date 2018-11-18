var data = require('./data.js')

var Resource = {
    name: "Resource",
    level: 1,
    quantity: 10,
    production: 1.1,
    cost: 25,
    userId: null,
    updatedAt: new Date(),
    createdAt: new Date(),
}

Resource.updateQuantity = function (userId) {

    data.resources.findOne({ userId: userId }, (err, doc) => {

        if (doc == null) {
            return { message: "internal error : no resource found for current user" }
        } else {

            var secondsElapsed = (new Date() - doc.updatedAt) / 1000
            var quantity = doc.quantity + (doc.production * secondsElapsed)
            var production = doc.level * Resource.production
            var cost = doc.level * Resource.cost

            data.resources.update({ userId: userId }, {
                $set: {
                    quantity: quantity,
                    updatedAt: new Date(),
                    production: production,
                    cost: cost
                }
            }, (err, num) => {
                return { message: "sucess : resource updated" }
            })
        }
    })

}

// function Resource(userId) {

//     this.name = "Resource"
//     this.level = 1
//     this.quantity = 10
//     this.production = 1.1
//     this.cost = 25
//     this.userId = userId
//     this.updatedAt = new Date()
//     this.createdAt = new Date()
// }

module.exports = Resource