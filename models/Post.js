var data = require('./data')

var Post = {}

function createPost(title, name, content, category, callback) {
    create(title, name, content, "post", category, null, null, (err, doc) => {
        callback(err, doc)
    })
}

function getPosts(category, callback) {
    data.posts.findOne({ category: category, postType: "post" }, (err, posts) => {
        callback(err, posts)
    })
}

function getPost(name, callback) {
    data.posts.findOne({ name: name, postType: "post" }, (err, post) => {
        callback(err, post)
    })
}

/*** Pages ***/
function createPage(title, name, content, callback) {
    create(title, name, content, "page", null, null, null, (err, doc) => {
        callback(err, doc)
    })
}

function deletePage(id, callback) {
    data.posts.remove( {_id : id}, (err, num) => {
        callback(err, num)
    })
}

function getPage(name, callback) {
    data.posts.findOne({ name: name, postType: "page" }, (err, page) => {
        callback(err, page)
    })
}

/*** Menus ***/
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

function getMenu(name, callback) {
    data.posts.findOne({ name: name, postType: "menu" }, (err, menu) => {
        callback(err, menu)
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
        $set: {
            title: title,
            name: name,
            content: content,
            postType: postType,     // Define the type of post (post, menu, page)
            category: category,     // Define custom category
            tag: tag,               // Define list of tags related to the post
            format: format,         // Define the format of the post (audio, video, text, link, default...)
            updatedAt: new Date()
        }
    }, (err, num) => {
        callback(err, num)
    })
}

Post.createPost = createPost
Post.getPosts = getPosts
Post.getPost = getPost

Post.createPage = createPage
Post.getPage = getPage
Post.deletePage = deletePage


Post.createMenu = createMenu
Post.updateMenu = updateMenu
Post.getMenus = getMenus
Post.getMenu = getMenu

// data.posts.update({}, {$set: {createdAt: new Date()}})

// createPost("Post 1", "Bla bla blabla blaaaaa <strong>strong</strong>")
// createPost("Post 2", "Bla bla blabla blaaaaa <strong>strong</strong>")

module.exports = Post