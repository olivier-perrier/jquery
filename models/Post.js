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

function createMenu(title, name, content, format, callback) {
    create(title, name, content, "menu", null, null, format, (err, doc) => {
        callback(err, doc)
    })
}


function updateMenu(title, name, content, format, callback) {
    update(title, name, content, "menu", null, null, format, (err, num) => {
        callback(err, num)
    })
}

function getMenus(callback) {
    data.posts.find({ postType: "menu" }, (err, menus) => {
        callback(err, menus)
    })
}

function create(title, name, content, postType, category, tag, format, callback) {
    data.posts.insert({
        title: title,
        name: name,
        content: content,
        postType: postType,     // Define the type of post (post, menu, page)
        category: category,     // Define custom category
        tag: tag,               // Define list of tags related to the post
        format: format,         // Define the format of the post (audio, video, text, link, default...)
        createdAt: new Date(),
        updatedAt: new Date()
    }, (err, doc) => {
        callback(err, doc)
    })
}

function update(title, name, content, postType, category, tag, format, callback) {
    data.posts.update({ name: name }, {
        title: title,
        name: name,
        content: content,
        postType: postType,         // Define the type of post (post, menu, page)
        category: category,     // Define custom category
        tag: tag,               // Define list of tags related to the post
        format: format,         // Define the format of the post (audio, video, text, link, default...)
        createdAt: new Date(),
        updatedAt: new Date()
    }, (err, num) => {
    callback(err, num)
})
}

Post.createPost = createPost

Post.createMenu = createMenu
Post.updateMenu = updateMenu
Post.getMenus = getMenus

// data.posts.update({}, {$set: {createdAt: new Date()}})

// createPost("Post 1", "Bla bla blabla blaaaaa <strong>strong</strong>")
// createPost("Post 2", "Bla bla blabla blaaaaa <strong>strong</strong>")

module.exports = Post