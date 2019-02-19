var data = require('./data')

var User = data.model('User')

var Comment = {

    commentSchema: {
        title: String,
        content: String,
        authorId: String,
        postId: String,
        createdAt: Date,
        updatedAt: Date,
    }
}

function create(comment, callback) {

    schemaCleaning(comment)

    // Add missed property from the schema
    for (var key in Comment.commentSchema) {
        if (!comment[key]) {
            comment[key] = ""
        }
    }

    comment.createdAt = new Date()

    data.comments.insert(comment, (err, comment) => {
        callback(err, comment)
    })
}

function update(commentId, comment, callback) {

    schemaCleaning(comment)

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

/*** Schema ***/
function schemaCleaning(comment) {
    // Remove property that are not into the schema
    for (var key in comment) {
        if (!Comment.commentSchema[key]) {
            console.warn("[WARNING] property '" + key + "' do not existe in the comment schema")
            delete comment[key]
        }
    }
}

Comment.create = create
Comment.update = update
Comment.remove = remove
Comment.get = get
Comment.getByPost = getByPost

module.exports = Comment