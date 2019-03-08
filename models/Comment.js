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

function create(comment, callback) {

    Comment.schemaCleaning(comment)

    Comment.schemaCompleting(comment)

    comment.createdAt = new Date()

    console.log(comment)

    data.comments.insert(comment, (err, comment) => {
        console.log(err)
        callback(err, comment)
    })
}

function update(commentId, comment, callback) {

    Comment.schemaCleaning(comment)

    comment.updatedAt = new Date()

    data.comments.update({ _id: commentId }, comment, (err, num) => {
        callback(err, num)
    })
}

function remove(commentId, callback) {
    data.comments.remove({ _id: commentId }, (err, num) => {
        callback(err, num)
    })
}

function getAll(callback) {
    data.comments.find({}, (err, comments) => {
        callback(err, comments)
    })
}

function get(commentId, callback) {
    data.comments.findOne({ _id: commentId }, (err, comment) => {
        callback(err, comment)
    })
}

function getByPost(postId, callback) {

    data.comments.find({ postId: postId }, (err, comments) => {

        User.getJoinedUsers(comments, (err, comments) => {
            callback(err, comments)
        })
    })
}

Comment.create = create
Comment.update = update
Comment.remove = remove
Comment.getAll = getAll
Comment.get = get
Comment.getByPost = getByPost

module.exports = Comment