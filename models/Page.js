var data = require('./data')
var opkey = require('./opkey')

var Page = new opkey.Model("Pages", "pages")

Page.add({
    title: { type: String, title: "Title", main: true, protected: false, autokey: true, ref: "pages" },
    authorId: { type: String, title: "Author", relationship: true, ref: 'users', path: "username", protected: true },
    createdAt: { type: Date, title: "Created", protected: true },
    status: { type: String, title: "Status" },
    // comment: { type: String, title: "Post", relationship: true, ref: 'posts', path: "name", protected: true },
})

Page.defaultColumns = ['title', 'authorId', 'createdAt', 'status']


function create(page, callback) {

    PageKey.schemaCleaning(page)

    PageKey.schemaCompleting(page)

    page.createdAt = new Date()

    console.log(page)

    data.pages.insert(comment, (err, page) => {
        console.log(err)
        callback(err, page)
    })
}

function update(pageId, page, callback) {

    PageKey.schemaCleaning(page)

    page.updatedAt = new Date()

    data.comments.update({ _id: pageId }, page, (err, num) => {
        callback(err, num)
    })
}

function remove(pageId, callback) {
    data.pages.remove({ _id: pageId }, (err, num) => {
        callback(err, num)
    })
}

function getAll(callback) {
    data.pages.find({}, (err, comments) => {
        callback(err, comments)
    })
}

function get(pageId, callback) {
    data.pages.findOne({ _id: pageId }, (err, comment) => {
        callback(err, comment)
    })
}

Page.create = create
Page.update = update
Page.remove = remove
Page.getAll = getAll
Page.get = get

module.exports = Page