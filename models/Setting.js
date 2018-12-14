var data = require('./data')

var Setting = {
    
    name: String,
    value: Object,
    
}

var menu = [
    {name: "contracts"}, 
    {name: "clients"}
]

Setting.menu = menu

module.exports = Setting