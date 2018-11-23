var data = require('./data')

var Post = {
    name: String,
    content: String
}

function createPost(name, content) {
    data.posts.insert({
        name: name,
        content: content,
        createdAt: new Date()
    }, (err, doc) => {
        console.log('Post created')
    })

}

// data.posts.update({}, {$set: {createdAt: new Date()}})

// createPost("Post 3", "Bla bla blabla blaaaaa <strong>strong</strong>")
// createPost("Post 3", "Bla bla blabla blaaaaa <strong>strong</strong>")

module.exports = Post