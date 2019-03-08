
var data = require('./data')

class Opkey {

    constructor() {
        // console.log("[DEBUG] register models")

        this.modelNames = [
            { name: "users2", modelName: "User2" },
            { name: "pages", modelName: "Page" },
            { name: "comments", modelName: "Comment" },
        ]

        data.createDatastores(this.modelNames.map(modelName => modelName.name))
        data.loadDatabases(this.modelNames.map(modelName => modelName.name))
    }

    /**
     * @param {String} modelKey model name key (posts, pages, users, comments, etc) 
     */
    getModel(modelKey) {
        var modelName = this.modelNames.find(model => model.name == modelKey)

        if (modelName) {
            console.log("[DEBUG] generic model found " + modelName.modelName)
            return data.model(modelName.modelName)
        } else {
            return null
        }
    }
}

class Model {

    constructor(title, name) {
        this.properties = {}
        this.schema = {}
        this.defaultColumns = []

        this.properties = {
            name: name,
            title: title
        }
    }

    add(schema) {
        this.schema = schema
    }

    /**
     * Built and return the post object for the client
     * Only use for single post
     * @param post post object format to display for the model
     */
    async getBuildPost(post) {

        // Add the id
        if (!this.schema._id) {
            this.schema._id = {}
            this.schema._id.value = post._id
            this.schema._id.viewType = "hidden"
        }

        for (var key in this.schema) {

            // Copy the brut value
            this.schema[key].value = post[key]

            // Some helper for the interface
            this.schema[key].disabled = this.schema[key].protected ? "disabled" : ""

            // if relationship
            if (this.schema[key].viewType == "relationship") {

                // console.log("[DEBUG] looking for relationship " + key + " " + post[key] + " in ref: " + ref + " path: " + path)

                this.schema[key].link = await this.asyncFindOne(post, key)

            }

        }

        return this.schema
    }

    /**
    * Built and return the posts objects array for the client
    * Only use for the multi post
    * @param posts posts object array from the database
    * @returns Posts array of the formated datas
    */
    async getBuildPosts(posts) {
        var postsBuilt = []

        // For every posts
        for (var post of posts) {

            var postToReturn = {} // object formated like a post { _id: xxx, author: xxx }

            // Add the id
            if (!this.schema._id) {
                postToReturn._id = {}
                postToReturn._id.value = post._id
                postToReturn._id.viewType = "delete"
                console.log("[DEBUG] adding id to the result")
            }

            // for every property in the columns to display
            for (var column of this.defaultColumns) {

                // get the corresponding line in the Schema
                if (this.schema[column]) {
                    postToReturn[column] = {}

                    postToReturn[column].value = post[column]
                    postToReturn[column].viewType = this.schema[column].viewType

                    // if date type
                    if (this.schema[column].type == Date) {
                        if (post[column]) postToReturn[column].value = this.toDate(post[column])
                    }

                    // if autokey for the tab
                    if (this.schema[column].viewType == "link") {
                        postToReturn[column].ref = this.properties.name
                        postToReturn[column].link = post._id
                    }

                    // if relationship
                    if (this.schema[column].viewType == "relationship") {
                        postToReturn[column].ref = this.schema[column].ref

                        // console.log("[DEBUG] looking for relationship " + column + " " + post[column] + " in ref: " + ref + " path: " + path)

                        postToReturn[column].link = await this.asyncFindOne(post, column)
                    }

                } else
                    console.log("[WARNING] property " + column + " not defined in the schema")

            }

            postsBuilt.push(postToReturn)

        }

        return postsBuilt

    }

    asyncFindOne(post, column) {
        return new Promise(resolve => {

            var ref = this.schema[column].ref
            var path = this.schema[column].path

            data[ref].findOne({ _id: post[column] }, (err, docpost) => {
                if (docpost) {
                    // console.log("[DEBUG] relationship found " + post[column] + " in ref: " + ref + " path: " + path)
                    resolve(docpost[path])
                } else {
                    console.log("[WARNING] not post found for " + post[column] + " in " + ref)
                    resolve(post[column])
                }
            })
        })
    }

    /**
     * @returns default properties of the model
     */
    getProperties() {
        return this.properties
    }

    /**
     * Used for database request
     * @returns the mongodb projection for columns to display in posts model
     */
    getProjection() {
        return this.defaultColumns.reduce((acc, val, index) => {
            acc[val] = 1
            return acc
        }, {})
    }

    /**
     * @returns the titles to display in the posts model
     */
    getColumnsTitles() {
        var columnsDisplay = []
        this.defaultColumns.map(column => {
            if (this.schema[column]) {
                columnsDisplay.push(this.schema[column].title)
            } else {
                console.log("[WARNING] column " + column + " is not in the Schema")
                columnsDisplay.push(column)
            }

        })

        return columnsDisplay
    }

    /**
     * Clean the post object by removing the properties that are not into the schema
     */
    schemaCleaning(post) {
        for (var key in post) {
            if (!this.schema[key]) {
                console.warn("[WARNING] property '" + key + "' do not existe in the comment schema")
                delete post[key]
            }
        }
    }

    /**
    * Clean the post object by removing the properties are protected
    */
    schemaChecking(post) {
        for (var key in post) {
            if (this.schema[key].protected) {
                console.warn("[WARNING] property '" + key + "' is protected")
                delete post[key]
            }
        }
    }

    /**
     * Complet the post object with the properties of the schema
     * @param {post} post to complet 
     */
    schemaCompleting(post) {
        for (var key in this.commentSchema) {
            if (!post[key] && key != "_id") {
                post[key] = ""
            }
        }
    }

    /*** default generic method to request database ***/
    create(post, callback) {
        console.log("[DEBUG] generic create")

        this.schemaCleaning(post)
        this.schemaCompleting(post)

        post.createdAt = new Date()

        data[this.properties.name].insert(post, (err, post) => {
            callback(err, post)
        })
    }

    update(postId, post, callback) {
        console.log("[DEBUG] generic update")

        this.schemaCleaning(post)
        this.schemaChecking(post)

        post.updatedAt = new Date()

        data[this.properties.name].update({ _id: postId }, { $set: post }, (err, num) => {
            callback(err, num)
        })

    }

    remove(postId, callback) {
        console.log("[DEBUG] generic remove")

        data[this.properties.name].remove({ _id: postId }, (err, num) => {
            callback(err, num)
        })
    }

    get(postId, callback) {
        console.log("[DEBUG] generic get")

        data[this.properties.name].findOne({ _id: postId }, (err, post) => {
            callback(err, post)
        })
    }

    getAll(callback) {
        console.log("[DEBUG] generic get all")

        data[this.properties.name].find({}, (err, posts) => {
            callback(err, posts)
        })
    }

    getByQuery(query, sort, limit, callback) {
        console.log("[DEBUG] generic get by query *** not tested ***")

        data[this.properties.name].find(query).short(sort).limit(limit).exec((err, posts) => {
            callback(err, posts)
        })
    }

    /**
     * @param {date} date to formated date 
     */
    toDate(date) {
        var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        if (date)
            return date.toLocaleDateString('en-EN', options)
    }
}

Opkey.Model = Model

module.exports = Opkey