var data = require('./data')

var Post = {
    name: String,
    content: String,
    createdAt: new Date(),
    updatedAt: new Date()
}

function createPost(name, content) {
    data.posts.insert({
        name: name,
        content: content,
        contentPreview: content.subString(1, 50),
        createdAt: new Date(),
        updatedAt: new Date()
    }, (err, doc) => {
        console.log('Post created')
    })

}

// data.posts.update({}, {$set: {createdAt: new Date()}})

// createPost("Post 1", "Bla bla blabla blaaaaa <strong>strong</strong>")
// createPost("Post 2", "Bla bla blabla blaaaaa <strong>strong</strong>")

module.exports = Post