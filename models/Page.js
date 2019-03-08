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

function create(page, callback) {

    Page.schemaCleaning(page)

    Page.schemaCompleting(page)

    page.createdAt = new Date()

    console.log(page)

    data.pages.insert(page, (err, page) => {
        console.log(err)
        callback(err, page)
    })
}

function update(postId, post, callback) {

    Page.schemaCleaning(post)
    
    Page.schemaChecking(post)

    post.updatedAt = new Date()

    data.pages.update({ _id: postId }, { $set: post }, (err, num) => {
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