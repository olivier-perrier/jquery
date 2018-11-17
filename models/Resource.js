var data = require('./data.js')

function Resource(userId) {

    this.name = "Resource"
    this.level = 1
    this.quantity = 10
    this.production = 1.1
    this.cost = 25
    this.userId = userId
    this.updatedAt = new Date()
    this.createdAt = new Date()


    this.updateQuantity = function (userId) {
        console.log(this.level)

        data.resources.findOne({ userId: userId }, (err, doc) => {

            if (doc == null) {
                return { message: "internal error : no resource found for user" }
            } else {

                var secondsElapsed = (new Date() - doc.updatedAt) / 1000
                var quantity = doc.quantity + (doc.production * secondsElapsed)

                data.resources.update({ userId: userId }, { $set: { quantity: quantity, updatedAt: new Date() } }, (err, num) => {
                    return { message: "sucess : resource updated" }
                })
            }

        })
    }
}

var ResourceObject = {
    name: "Resource",
    level: 1,
    quantity: 10,
    production: 1.1,
    cost: 25,
    userId: null,
    updatedAt: new Date(),
    createdAt: new Date(),
}

module.exports = Resource