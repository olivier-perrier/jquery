var data = require('./data')

var DefenceSchema = {
    name: "Space ship",
    number : Number,
    attack: 1,
    defence: 2,
    userId: String,
    createdAt: new Date(),
    updatedAt: new Date(),

}

function createDefence(userId) {
    console.log('createDefence')
    var defence = DefenceSchema
    defence.number = 0
    defence.userId = userId

    data.defences.insert(DefenceSchema, (err, doc) => {
        return doc
    })

}

function Defence(userId) {
    this.name = "Space ship"
    this.number = 0
    this.attack = 1
    this.defence = 2
    this.userId = userId
}

// var Defence = {
//     DefenceSchema: DefenceSchema,
//     createDefence: createDefence
// }

module.exports = Defence