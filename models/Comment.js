var data = require('./data')
var opkey = require('./opkey')

var User = data.model('User')


var Comment = new opkey.Model("Comments", "comments")


Comment.add({
    _id: { type: String, title: "Id", main: true, viewType:"link", protected: true },
    content: { type: String, title: "Content", viewType: "textarea" },
    status: { type: String, title: "Status", viewType: "string" },
    authorId: { type: String, title: "Author", viewType: "relationship", ref: 'users', path: "username", protected: true },
    postId: { type: String, title: "Post", viewType: "relationship", ref: 'posts', path: "name", protected: true },
    createdAt: { type: Date, title: "Created", viewType: "string", protected: true },
    updatedAt: { type: Date, title: "Updated", viewType: "string", protected: true },
})

Comment.defaultColumns = ['_id', 'authorId', 'postId', 'status', 'createdAt']


module.exports = Comment