function Resource(level){

    this.name = "Resource",
    this.level = level
    this.quantity = 10
    this.production = 1.1
    this.cost = 250
    this.userId = null
    this.updatedAt = new Date()
    this.createdAt = new Date()

    function update() {
        var secondsElapsed = (new Date() - this.updatedAt) / 1000
        this.updatedAt = new Date()
        this.quantity += (this.production * this.level) * secondsElapsed
    }
}

module.exports = Resource