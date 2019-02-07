var data = require('./data')

var Post = {
    
    postSchema = {
        title: title,
        name: name,
        content: content,
        description : description,
        postType: postType,     // Define the type of post (post, menu, page)
        category: category,     // Define custom category
        tags: tags,             // Define list of tags related to the post
        format: format,         // Define the format of the post (audio, video, text, link, default...)
        createdAt: new Date(),
        updatedAt: new Date()
    }
}

function createPost(title, name, content, category = null, tags = null, format = null, callback) {
    create(title, name, content, "post", category, tags, format, (err, doc) => {
        callback(err, doc)
    })
}

function getPosts(query, callback) {
    query.postType = "post"
    data.posts.find(query, (err, posts) => {
        callback(err, posts)
    })
}

function getPost(postId, callback) {
    data.posts.findOne({ _id: postId, postType: "post" }, (err, post) => {
        callback(err, post)
    })
}

function getPostByName(postName, callback) {
    data.posts.findOne({ name: postName, postType: "post" }, (err, post) => {
        callback(err, post)
    })
}

function updatePost(postId, title, name, content, category = null, tags = null, format = null, callback) {
    update(postId, title, name, content, "post", category, tags, format, (err, num) => {
        callback(err, num)
    })
}

function updatePost2(post, callback) {
    post.postType = "post"
    update2(post, (err, num) => {
        callback(err, num)
    })
}

/*** Pages ***/
function createPage(title, name, content, callback) {
    create(title, name, content, "page", null, null, null, (err, doc) => {
        callback(err, doc)
    })
}

function updatePage(pagetId, title, name, content, category = null, tags = null, format = null, callback) {
    update(pagetId, title, name, content, "page", category, tags, format, (err, num) => {
        callback(err, num)
    })
}

function deletePage(id, callback) {
    data.posts.remove({ _id: id }, (err, num) => {
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

/*** Private ***/
function create(title, name, content, postType, category, tags, format, callback) {
    data.posts.insert({
        title: title,
        name: name,
        content: content,
        postType: postType,     // Define the type of post (post, menu, page)
        category: category,     // Define custom category
        tags: tags,             // Define list of tags related to the post
        format: format,         // Define the format of the post (audio, video, text, link, default...)
        createdAt: new Date(),
        updatedAt: new Date()
    }, (err, doc) => {
        callback(err, doc)
    })
}

function update(id, title, name, content, postType, category, tags, format, callback) {
    data.posts.update({ _id: id }, {
        $set: {
            title: title,
            name: name,
            content: content,
            postType: postType,     // Define the type of post (post, menu, page)
            category: category,     // Define custom category
            tags: tags,             // Define list of tags related to the post
            format: format,         // Define the format of the post (audio, video, text, link, default...)
            updatedAt: new Date()
        }
    }, (err, num) => {
        callback(err, num)
    })
}

function update2(post, callback) {
    post.updatedAt = new Date()

    data.posts.update({ _id: post._id }, {
        $set: post
    }, (err, num) => {
        callback(err, num)
    })
}

Post.createPost = createPost
Post.updatePost = updatePost
Post.updatePost2 = updatePost2
Post.getPosts = getPosts
Post.getPost = getPost
Post.getPostByName = getPostByName

Post.createPage = createPage
Post.updatePage = updatePage
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