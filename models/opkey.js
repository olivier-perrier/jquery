
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
        var postToReturn = {}

        for (var key in this.schema) {
            postToReturn[key] = {}

            postToReturn[key].main = this.schema[key].main
            postToReturn[key].name = this.schema[key].name
            postToReturn[key].title = this.schema[key].title
            postToReturn[key].value = post[key]
            postToReturn[key].disabled = this.schema[key].protected ? "disabled" : ""
            postToReturn[key].relationship = this.schema[key].relationship



            if (this.schema[key] && this.schema[key].relationship) {

                postToReturn[key].link = post[key]
                postToReturn[key].ref = this.schema[key].ref

                var ref = this.schema[key].ref
                var path = this.schema[key].path

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
    * Only use for the multi post
    * @param posts posts object array from the database
    * @returns Posts array of the formated datas
    */
    getBuildPosts(posts) {
        var postsBuilt = []

        // For every posts
        posts.forEach(post => {

            var postToReturn = {} // object formated like a post { _id: xxx, author: xxx }

            // for every property in the columns to display
            this.defaultColumns.forEach(column => {

                // get the corresponding line in the Schema
                if (this.schema[column]) {
                    postToReturn[column] = {}

                    postToReturn[column].name = this.schema[column].name
                    postToReturn[column].title = this.schema[column].title
                    postToReturn[column].value = post[column]
                    postToReturn[column].disabled = this.schema[column].protected ? "disabled" : ""
                    postToReturn[column].relationship = this.schema[column].relationship
                    
                    postToReturn[column].autokey = this.schema[column].autokey

                    // if autokey
                    if (this.schema[column].autokey) {
                        postToReturn[column].value = post[column]
                        postToReturn[column].link = post["_id"]
                        postToReturn[column].ref = this.schema[column].ref
                    }

                    // if date type
                    if (this.schema[column].type == Date) {
                        if (post[column]) postToReturn[column].value = this.toDate(post[column])
                    }

                    // if relationship
                    if (this.schema[column].relationship) {
                        postToReturn[column].link = post[column]
                        postToReturn[column].ref = this.schema[column].ref

                        var ref = this.schema[column].ref
                        var path = this.schema[column].path

                        console.log("[DEBUG] looking for relationship " + post[column] + " in ref: " + ref + " path: " + path)

                        if (post[column])
                            data[ref].findOne({ _id: post[column] }, (err, docpost) => {
                                if (docpost) {
                                    postToReturn[column].value = docpost[path]
                                    console.log("[DEBUG] relationship found " + post[column] + " in ref: " + ref + " path: " + path)

                                } else {
                                    postToReturn[column].value = post[column]
                                    console.log("[WARNING] not post found for " + post[column] + " in " + ref)
                                }
                            })
                    }


                    postToReturn[column].view = this.schema[column].view
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
            if (!Comment.schema[key]) {
                console.warn("[WARNING] property '" + key + "' do not existe in the comment schema")
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