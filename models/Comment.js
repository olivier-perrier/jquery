var data = require('./data')

var User = data.model('User')

var Comment = {}

Comment.properties = {
    title: "Comments",
    name: "comments"
}

Comment.commentSchema = {
    _id: { type: String, title: "Id", view: "link" },
    title: { type: String, title: "Title", comment: "", main: true },
    content: { type: String, title: "Content", comment: "", textarea: true },
    status: { type: String, title: "Status", comment: "" },
    authorId: { type: String, title: "Author", comment: "", view: "link", relationship: true, ref: 'users', path: "username", disabled: "disabled" },
    postId: { type: String, title: "Post", comment: "", view: "link", relationship: true, ref: 'posts', path: "name", disabled: "disabled" },
    createdAt: { type: Date, title: "Created", comment: "", disabled: "disabled" },
    updatedAt: { type: Date, title: "Updated", comment: "", disabled: "disabled" },
    test: { type: String, title: "Test", comment: "", relationship: true, ref: 'posts' },
}
Comment.defaultColumns = ['_id', 'authorId', 'postId', 'status', 'createdAt']

/*** return the projection object of the columns to projection by database ***/
Comment.getProjection = function () {
    return this.defaultColumns.reduce((acc, val, index) => {
        acc[val] = 1
        return acc
    }, {})
}

/*** return the titles of the columns names to display ***/
Comment.getColumnsTitles = function () {
    var columnsDisplay = []
    this.defaultColumns.map(column => {
        if (this.commentSchema[column]) {
            columnsDisplay.push(this.commentSchema[column].title)
        } else {
            console.log("[WARNING] column " + column + " is not in the Schema")
            columnsDisplay.push(column)
        }

    })

    return columnsDisplay
}

/***
 * Return the result of the request formated with entries for the generic view
 */
Comment.getBuildRequest = function (posts) {

    var postsBuilt = []

    // For every posts
    posts.forEach(post => {
        var postToReturn = {} // object formated like a post { _id: xxx, author: xxx }

        // for every property in the columns to display
        this.defaultColumns.forEach(column => {

            // get the corresponding line in the Schema
            if (this.commentSchema[column]) {
                postToReturn[column] = {}

                // if relationship
                if (this.commentSchema[column].relationship) {
                    postToReturn[column].link = post[column]
                    postToReturn[column].ref = this.commentSchema[column].ref

                    var ref = this.commentSchema[column].ref
                    var path = this.commentSchema[column].path

                    console.log("relationship found for " + post[column] + " ref: " + ref)
                    data[ref].findOne({ _id: post[column] }, (err, docpost) => {
                        if (docpost)
                            postToReturn[column].value = docpost[path]
                        else {
                            postToReturn[column].value = post[column]
                            console.log("[WARNING] not post found for " + post[column] + " in " + ref)
                        }
                    })
                } else {

                    postToReturn[column].value = post[column]
                }


                postToReturn[column].view = this.commentSchema[column].view
            } else
                console.log("[WARNING] property " + column + " not defined in the schema")

        })

        postsBuilt.push(postToReturn)

    })

    return postsBuilt
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
Comment.getAll = getAll
Comment.get = get
Comment.getByPost = getByPost

module.exports = Comment