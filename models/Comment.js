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
    comment.createdAt = new Date()
    data.comments.insert(comment, (err, comment) => {
        callback(err, comment)
    })
}

function update(commentId, comment, callback) {
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

function getJoinedUsers(comments, callback) {
    var authorIds = comments.map(comment => comment.authorId)

    User.getUsers(authorIds, (err, users) => {

        comments.forEach((comment, i) => {

            var currentUser = users.find(user => {
                return comments[i].authorId == user._id
            })

            if (currentUser)
                comments[i].authorUsername = currentUser.username

        })

        callback(err, comments)
    })
}

function getByPost(postId, callback) {

    data.comments.find({ postId: postId }, (err, comments) => {

        getJoinedUsers(comments, (err, comments) => {
            callback(err, comments)
        })
    })
}

Comment.create = create
Comment.update = update
Comment.remove = remove
Comment.get = get
Comment.getByPost = getByPost

module.exports = Comment