var data = require('./data')

var Post = {

    postSchema: {
        title: String,
        name: String,
        content: String,
        description: String,
        postType: String,     // Define the type of post (post, menu, page)
        category: String,     // Define custom category
        tags: String,         // Define list of tags related to the post
        format: String,       // Define the format of the post (audio, video, text, link, default...)
        authorId: String,
        createdAt: new Date(),
        updatedAt: new Date()
    }
}

function createPost(post, callback) {
    post.postType = "post"
    create2(post, (err, doc) => {
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

function updatePost(post, callback) {
    post.postType = "post"
    update(post.id, post, (err, num) => {
        callback(err, num)
    })
}

/*** Pages ***/
function createPage(title, name, content, callback) {
    create(title, name, content, "page", null, null, null, (err, doc) => {
        callback(err, doc)
    })
}

function updatePage(page, callback) {
    page.postType = "page"
    update(page.id, page, (err, num) => {
        callback(err, num)
    })
}

function deletePage(id, callback) {
    remove(id, (err, num) => {
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

function updateMenu(menu, callback) {
    menu.postType = "menu",
        update(menu, (err, num) => {
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

/*** Media ***/
function createMedia(media, callback) {
    media.postType = "media"
    create2(media, (err, doc) => {
        callback(err, doc)
    })
}

function deleteMedia(id, callback) {
    remove(id, (err, num) => {
        callback(err, num)
    })
}

function getMedia(id, callback) {
    get(id, (err, media) => {
        callback(err, media)
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

function create2(post, callback) {

    /* remove undifined properties */
    Object.keys(post).forEach(key => {
        if (post[key] === undefined) {
            delete post[key];
        }
    })

    post.createdAt = new Date()

    data.posts.insert(post, (err, doc) => {
        callback(err, doc)
    })
}

function update(id, post, callback) {

    /* remove undifined properties */
    Object.keys(post).forEach(key => {
        if (post[key] === undefined) {
            delete post[key];
        }
    })

    post.updatedAt = new Date()

    data.posts.update({ _id: id }, {
        $set: post
    }, (err, num) => {
        callback(err, num)
    })
}

function remove(id, callback) {
    data.posts.remove({ _id: id }, (err, num) => {
        callback(err, num)
    })
}

function get(id, callback) {
    data.posts.findOne({ _id: id }, (err, post) => {
        callback(err, post)
    })
}

Post.createPost = createPost
Post.updatePost = updatePost
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

Post.createMedia = createMedia
Post.deleteMedia = deleteMedia
Post.getMedia = getMedia



module.exports = Post