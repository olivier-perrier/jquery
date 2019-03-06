var data = require('./data')

var User = data.model('User')

var Comment = {}

Comment.properties = {
    title: "Comments",
    name: "comments"
}

Comment.commentSchema = {
    _id: { type: String, title: "Id", main: true, protected: true, relationship: true, ref: 'comments', path: "_id", protected: true },
    content: { type: String, title: "Content", textarea: true },
    status: { type: String, title: "Status" },
    authorId: { type: String, title: "Author", relationship: true, ref: 'users', path: "username", protected: true },
    postId: { type: String, title: "Post", relationship: true, ref: 'posts', path: "name", protected: true },
    createdAt: { type: Date, title: "Created", protected: true },
    updatedAt: { type: Date, title: "Updated", protected: true },
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

/**
 * Built and return the post object for the client
 * Only use for the tabs
 * @param post post object of the database
 */
Comment.getBuildPost = function (post) {

    var postToReturn = {}

    for (var key in this.commentSchema) {
        postToReturn[key] = {}

        postToReturn[key].main = this.commentSchema[key].main
        postToReturn[key].name = this.commentSchema[key].name
        postToReturn[key].title = this.commentSchema[key].title
        postToReturn[key].value = post[key]
        postToReturn[key].disabled = this.commentSchema[key].protected ? "disabled" : ""
        postToReturn[key].relationship = this.commentSchema[key].relationship



        if (this.commentSchema[key] && this.commentSchema[key].relationship) {

            postToReturn[key].link = post[key]
            postToReturn[key].ref = this.commentSchema[key].ref

            var ref = this.commentSchema[key].ref
            var path = this.commentSchema[key].path

            if (post[key])
                data[ref].findOne({ _id: post[key] }, (err, docpost) => {
                    if (docpost) {
                        postToReturn[key].value = docpost[path]
                    } else {
                        postToReturn[key].value = post[key]
                        console.log("[WARNING] not post found for " + post[key] + " in " + ref)
                    }
                })


        }

    }

    return postToReturn

}


/**
 * Built and return the posts objects array for the client
 * Only use for the single post
 * @param post posts object array from the database
 */
Comment.getBuildPosts = function (posts) {

    var postsBuilt = []

    // For every posts
    posts.forEach(post => {

        var postToReturn = {} // object formated like a post { _id: xxx, author: xxx }

        // for every property in the columns to display
        this.defaultColumns.forEach(column => {

            // get the corresponding line in the Schema
            if (this.commentSchema[column]) {
                postToReturn[column] = {}

                postToReturn[column].name = this.commentSchema[column].name
                postToReturn[column].title = this.commentSchema[column].title
                postToReturn[column].value = post[column]
                postToReturn[column].disabled = this.commentSchema[column].protected ? "disabled" : ""
                postToReturn[column].relationship = this.commentSchema[column].relationship

                // if date type

                if (this.commentSchema[column].type == Date) {
                    if (post[column])
                        postToReturn[column].value = toDate(post[column])
                }

                // if relationship
                if (this.commentSchema[column] && this.commentSchema[column].relationship) {
                    postToReturn[column].link = post[column]
                    postToReturn[column].ref = this.commentSchema[column].ref

                    var ref = this.commentSchema[column].ref
                    var path = this.commentSchema[column].path

                    if (post[column])
                        data[ref].findOne({ _id: post[column] }, (err, docpost) => {
                            if (docpost)
                                postToReturn[column].value = docpost[path]
                            else {
                                postToReturn[column].value = post[column]
                                console.log("[WARNING] not post found for " + post[column] + " in " + ref)
                            }
                        })
                }


                postToReturn[column].view = this.commentSchema[column].view
            } else
                console.log("[WARNING] property " + column + " not defined in the schema")

        })

        postsBuilt.push(postToReturn)

    })

    return postsBuilt
}

function toDate(date) {
    var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    if (date)
        return date.toLocaleDateString('en-EN', options)
}

function create(comment, callback) {

    schemaCleaning(comment)

    schemaCompleting(comment)

    comment.createdAt = new Date()

    console.log(comment)

    data.comments.insert(comment, (err, comment) => {
        console.log(err)
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

/**
 * Formet the post with the schema by adding missing entries.
 * _id entry is not added
 */
function schemaCompleting(post) {
    for (var key in this.commentSchema) {
        if (!post[key] && key != "_id") {
            post[key] = ""
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