var data = require('./data')

var Post = {
    name: String,
    content: String,
    contentPreview: String,
    createdAt: new Date(),
    updatedAt: new Date()
}

function createPost(name, content, callback) {

    create(name, name, content, "post", (err, doc) => {
        callback(err, doc)
    })
}

function createMenu(name, content, callback) {

    create(name, name, content, "menu", (err, doc) => {
        callback(err, doc)
    })
}

function getMenus(callback) {

    data.posts.find({postType: "menu"}, (err, menus) => {
        callback(err, menus)
    })
}

function create(title, name, content, type, callback) {
    data.posts.insert({
        title: title,
        name: name,
        content: content,
        contentPreview: content.substring(1, 50),
        postType: type,
        createdAt: new Date(),
        updatedAt: new Date()
    }, (err, doc) => {
        callback(err, doc)
    })
}

Post.createPost = createPost

Post.createMenu = createMenu
Post.getMenus = getMenus

// data.posts.update({}, {$set: {createdAt: new Date()}})

// createPost("Post 1", "Bla bla blabla blaaaaa <strong>strong</strong>")
// createPost("Post 2", "Bla bla blabla blaaaaa <strong>strong</strong>")

module.exports = Post