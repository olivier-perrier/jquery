var data = require('./data')

var Post = {
    name: String,
    content: String
}

function createPost(name, content) {
    data.posts.insert({name: name, content: content}, (err, doc) => {
        console.log('Post created')
    })

}

// createPost("Salut 2", "Bla bla blabla blaaaaa")

module.exports = Post