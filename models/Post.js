var data = require('./data')

var User = data.model('User')

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
        image: String,
        authorId: String,
        parentId: String,
        order: Number,
        status: String,
        createdAt: new Date(),
        updatedAt: new Date()
    }
}

function createPost(post, callback) {
    post.postType = "post"
    create(post, (err, doc) => {
        callback(err, doc)
    })

}

function getPosts(query, callback) {
    query.postType = "post"
    data.posts.find(query, (err, posts) => {
        User.getJoinedUsers(posts, (err, post) => {
            callback(err, posts)
        })
    })
}

function getPost(postId, callback) {
    get(postId, (err, post) => {
        User.getJoinedUser(post, (err, post) => {
            callback(err, post)
        })
    })
}

function getPostByName(postName, callback) {
    data.posts.findOne({ name: postName, postType: "post" }, (err, post) => {
        callback(err, post)
    })
}

function updatePost(postId, post, callback) {
    post.postType = "post"
    update(postId, post, (err, num) => {
        callback(err, num)
    })
}

function removePost(postId, callback) {
    remove(postId, (err, num) => {
        callback(err, num)
    })
}

/*** Pages ***/
function createPage(page, callback) {
    page.postType = "page"
    create(page, (err, page) => {
        callback(err, page)
    })
}

function updatePage(pageId, page, callback) {
    page.postType = "page"
    update(pageId, page, (err, num) => {
        callback(err, num)
    })
}

function removePage(id, callback) {
    remove(id, (err, num) => {
        callback(err, num)
    })
}

function getPage(pageId, callback) {
    get(pageId, (err, page) => {
        callback(err, page)
    })
}

function getPageByName(pageName, callback) {
    data.posts.findOne({ name: pageName, postType: "page" }, (err, page) => {
        callback(err, page)
    })
}

/*** Menus ***/
function createMenu(menu, callback) {
    menu.postType = "menu"
    create(menu, (err, menu) => {
        callback(err, menu)
    })
}

function updateMenu(menuId, menu, callback) {
    menu.postType = "menu",
        update(menuId, menu, (err, num) => {
            callback(err, num)
        })
}

function getMenus(callback) {
    data.posts.find({ postType: "menu" }, (err, menus) => {
        callback(err, menus)
    })
}

function getMenu(menuId, callback) {
    get(menuId, (err, menu) => {
        callback(err, menu)
    })
}

function getMenuByName(name, callback) {
    data.posts.findOne({ name: name, postType: "menu" }, (err, doc) => {
        callback(err, doc)
    })
}

function removeMenu(menuId, callback) {
    remove(menuId, (err, num) => {
        callback(err, num)
    })
}

/*** Media ***/
function createMedia(media, callback) {
    media.postType = "media"
    create(media, (err, doc) => {
        callback(err, doc)
    })
}

function removeMedia(id, callback) {
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

function create(post, callback) {

    schemaCleaning(post)

    // Add missed property from the schema
    for (var key in Post.postSchema) {
        if (!post[key]) {
            post[key] = ""
        }
    }

    // Add creation date
    post.createdAt = new Date()

    // console.log(post)

    data.posts.insert(post, (err, doc) => {
        callback(err, doc)
    })
}

function update(id, post, callback) {

    schemaCleaning(post)

    // Set updated date
    post.updatedAt = new Date()

    data.posts.update({ _id: id }, { $set: post }, (err, num) => {
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

/*** Schema ***/
function schemaCleaning(post) {
    // Remove not existing properties into the schema
    for (var key in post) {
        if (!Post.postSchema[key]) {
            console.warn("[WARNING] property '" + key + "' do not existe in the post schema")
            delete post[key]
        }
    }
}

Post.createPost = createPost
Post.updatePost = updatePost
Post.removePost = removePost
Post.getPosts = getPosts
Post.getPost = getPost
Post.getPostByName = getPostByName

Post.createPage = createPage
Post.updatePage = updatePage
Post.removePage = removePage
Post.getPage = getPage
Post.getPageByName = getPageByName

Post.createMenu = createMenu
Post.updateMenu = updateMenu
Post.removeMenu = removeMenu
Post.getMenus = getMenus
Post.getMenu = getMenu
Post.getMenuByName = getMenuByName

Post.createMedia = createMedia
Post.removeMedia = removeMedia
Post.getMedia = getMedia

var aboutPage = require('../plugins/aboutPage')
var helloPost = require('../plugins/helloPost')

/*** Create default datas ***/

getPageByName("about", (err, page) => {

    if (!page)
        Post.createPage(aboutPage, (err, page) => {
            console.log("[INFO] default page created")
        })
})

getPostByName("hello-world", (err, post) => {

    if (!post)
        Post.createPost(helloPost, (err, post) => {
            console.log("[INFO] default post created")
        })
})

getMenuByName("google", (err, menu) => {

    if (!menu)
        Post.createMenu({ title: "Google", name: "google", format: "direct", content: "www.google.fr" }, (err, menu) => {
            console.log("[INFO] default menu created")
        })
})

getMenuByName("about", (err, menu) => {

    if (!menu)
        Post.createMenu({ title: "About", name: "about", format: "page", content: "about" }, (err, menu) => {
            console.log("[INFO] default menu created")
        })
})

getMenuByName("hello-world", (err, menu) => {

    if (!menu)
        Post.createMenu({ title: "Hello World", name: "hello-world", format: "post", content: "hello-world" }, (err, menu) => {
            console.log("[INFO] default menu created")
        })
})

module.exports = Post