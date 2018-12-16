var data = require('./data')

var Post = {
    name: String,
    content: String,
    contentPreview: String,
    createdAt: new Date(),
    updatedAt: new Date()
}

function createPost(name, content, callback) {
    data.posts.insert({
        name: name,
        content: content,
        contentPreview: content.substring(1, 50),
        createdAt: new Date(),
        updatedAt: new Date()
    }, (err, doc) => {
        callback(err, doc)
    })

}

Post.createPost = createPost

// data.posts.update({}, {$set: {createdAt: new Date()}})

// createPost("Post 1", "Bla bla blabla blaaaaa <strong>strong</strong>")
// createPost("Post 2", "Bla bla blabla blaaaaa <strong>strong</strong>")

module.exports = Post