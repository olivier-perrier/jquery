var data = require('./data')
var opkey = require('./opkey')

var Page = new opkey.Model("Pages", "pages")

Page.add({
    title: { type: String, title: "Title", main: true, viewType: "link" },
    content: { type: String, title: "Content", viewType: "textarea" },
    authorId: { type: String, title: "Author", viewType: "relationship", ref: 'users', path: "username", protected: true },
    createdAt: { type: Date, title: "Created", viewType: "string", protected: true },
    status: { type: String, title: "Status", viewType: "string", },
})

Page.defaultColumns = ['title', 'authorId', 'createdAt', 'status']

module.exports = Page