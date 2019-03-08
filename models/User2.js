var data = require('./data')
var opkey = require('./opkey')

var Users2 = new opkey.Model("Users2", "users2")

Users2.add({
    name: { type: String, title: "Username", main: true, viewType: "link" },
    firstName: { type: String, title: "Name", viewType: "string" },
    lastName: { type: String, title: "Last name", viewType: "string" },
    email: { type: String, title: "Email", viewType: "string" },
    role: { type: String, title: "Status", viewType: "string", },
    password: { type: String, title: "Password", viewType: "password", },
    createdAt: { type: Date, title: "Created", viewType: "string", protected: true },
    updatedAt: { type: Date, title: "Created", viewType: "string", protected: true },
})

Users2.defaultColumns = ['name', 'firstName', 'email', 'role']

module.exports = Users2