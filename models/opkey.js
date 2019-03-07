
var data = require('./data')

class Opkey { }

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
    getBuildPost(post) {

        // Add the id
        this.schema._id = {}
        this.schema._id.value = post._id
        this.schema._id.viewType = "hidden"

        for (var key in this.schema) {

            // Copy the brut value
            this.schema[key].value = post[key]

            // Some helper for the interface
            this.schema[key].disabled = this.schema[key].protected ? "disabled" : ""

            // if relationship
            if (this.schema[key].viewType == "relationship") {

                var ref = this.schema[key].ref
                var path = this.schema[key].path

                data[ref].findOne({ _id: post[key] }, (err, docpost) => {
                    if (docpost) {
                        this.schema[key].link = docpost[path]
                    } else {
                        console.log("[WARNING] not post found for key: " + key + " " + post[key] + " in " + ref)
                    }
                })


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
    getBuildPosts(posts) {
        var postsBuilt = []

        // For every posts
        posts.forEach(post => {

            var postToReturn = {} // object formated like a post { _id: xxx, author: xxx }

            // Add the id
            postToReturn._id = {}
            postToReturn._id.value = post._id
            postToReturn._id.viewType = "delete"

            // for every property in the columns to display
            this.defaultColumns.forEach(column => {

                // get the corresponding line in the Schema
                if (this.schema[column]) {
                    postToReturn[column] = {}

                    // postToReturn[column].title = this.schema[column].title
                    postToReturn[column].value = post[column]
                    postToReturn[column].viewType = this.schema[column].viewType

                    // if date type
                    if (this.schema[column].type == Date) {
                        if (post[column]) postToReturn[column].value = this.toDate(post[column])
                    }

                    // if autokey for the tab
                    if (this.schema[column].viewType == "link") {
                        console.log("adding link" + post._id)
                        postToReturn[column].ref = this.properties.name
                        postToReturn[column].link = post._id
                    }

                    // if relationship
                    if (this.schema[column].viewType == "relationship") {
                        postToReturn[column].link = post[column]
                        postToReturn[column].ref = this.schema[column].ref

                        var ref = this.schema[column].ref
                        var path = this.schema[column].path

                        // console.log("[DEBUG] looking for relationship " + column + " " + post[column] + " in ref: " + ref + " path: " + path)

                        data[ref].findOne({ _id: post[column] }, (err, docpost) => {
                            if (docpost) {
                                postToReturn[column].link = docpost[path]
                                // console.log("[DEBUG] relationship found " + post[column] + " in ref: " + ref + " path: " + path)
                            } else {
                                console.log("[WARNING] not post found for " + post[column] + " in " + ref)
                            }
                        })
                    }

                } else
                    console.log("[WARNING] property " + column + " not defined in the schema")

            })

            postsBuilt.push(postToReturn)

        })

        return postsBuilt
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
            if (!this.schema[key] || this.schema[key].protected) {
                console.warn("[WARNING] property '" + key + "' do not existe in the comment schema or protected")
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

    /**
     * @private
     * @param {date} date to format 
     */
    toDate(date) {
        var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        if (date)
            return date.toLocaleDateString('en-EN', options)
    }
}

Opkey.Model = Model

module.exports = Opkey