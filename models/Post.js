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
    create(post, (err, doc) => {
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
    get(postId, (err, post) => {
        callback(err, post)
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

function updatePage(page, callback) {
    page.postType = "page"
    update(page.id, page, (err, num) => {
        callback(err, num)
    })
}

function removePage(id, callback) {
    remove(id, (err, num) => {
        callback(err, num)
    })
}

function getPage(name, callback) {
    data.posts.findOne({ name: name, postType: "page" }, (err, page) => {
        callback(err, page)
    })
}

function getPageByName(PageName, callback) {
    data.posts.findOne({ name: PageName, postType: "page" }, (err, page) => {
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

    /* remove undifined properties */
    Object.keys(post).forEach(key => {
        if (post[key] === undefined) {
            delete post[key];
        }
    })

    post.createdAt = new Date()
    post.updatedAt = new Date()

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

Post.createMedia = createMedia
Post.removeMedia = removeMedia
Post.getMedia = getMedia

module.exports = Post