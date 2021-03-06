var data = require("../components/data.js");

var postController = {
    index,
    create,
    getById,
    store,
    remove
}

// Get all posts
function index(req, res) {

    var sort = req.query.sort
    var query = req.query.query || ""

    // Met en forme la query en json pour la base de données
    var pasedQuery = JSON.parse("{ " + query + " }")

    data._posts.find({}).sort({ [sort]: 1 }).exec((err, posts) => {
        if (posts) {
            // Caster les types pour l'envoie au client
            console.log("[DEBUG] posts found : " + posts.length);
            res.send({ message: "success : posts found", posts });
        } else {
            res.send({ message: "no post found" });
        }
    });
}

// get a post by Id
function getById(req, res) {
    var postId = req.params.postId

    console.log(postId)

    data._posts.findOne({ _id: postId }, (err, post) => {
        if (post)
            res.send({ message: "success : post found", post });
        else
            res.send({ message: "database error : impossible to find post" });
    })
}


// Create a post of the custom type
function create(req, res) {
    var postTypeId = req.query.postTypeId;
    var newPost = req.body.customType;

    newPost = newPost || {}

    newPost.postTypeId = postTypeId;
    newPost.createdAt = new Date();

    data._posts.insert(newPost, (err, post) => {
        if (post) {
            res.send({ message: "success : post created", post });
        } else {
            res.send({ message: "database error : impossible to create post" });
        }
        console.log("[DEBUG] post (" + postTypeId + ") created " + post._id)
    });
}

// Update a post of a custom type
function store(req, res) {
    var postId = req.params.postId

    var newPost = req.body.post

    newPost = newPost || {}
    newPost.updatedAt = new Date()
    newPost.createdAt = newPost.createdAt || new Date()

    console.log("newPost before cast")
    console.log(newPost)

    // Cast les attributs
    data._posts.findOne({ _id: postId }, (err, post) => {
        if (post) {

            data.customTypes.findOne({ _id: post.postTypeId }, (err, postType) => {
                if (postType) {
                    // console.log("postType " + postType.name)

                    var postTypeSettings = JSON.parse(postType.setting)
                    for (var fieldPostType of postTypeSettings) {
                        // console.log("fieldPostType " + fieldPostType)

                        if (fieldPostType.type) {

                            // console.log("[CAST] nom du champ (" + fieldPostType.name + ") type du champ " + fieldPostType.type)

                            if (fieldPostType.type == "String") {
                                console.log("cast du champ " + fieldPostType.name + " en type String")
                                newPost[fieldPostType.name] = String(newPost[fieldPostType.name])
                            } else if (fieldPostType.type == "Number") {
                                console.log("cast du champ " + fieldPostType.name + " en type Number")
                                newPost[fieldPostType.name] = Number(newPost[fieldPostType.name])
                            } else if (fieldPostType.type == "Json") {
                                console.log("cast du champ " + fieldPostType.name + " en type JSON")
                                try {
                                    newPost[fieldPostType.name] = JSON.parse(newPost[fieldPostType.name])
                                } catch (error) {
                                    console.log("[ERROR] impossible to parse json for " + fieldPostType.name)
                                    console.log(newPost[fieldPostType.name])
                                }
                            } else if (fieldPostType.type == "Date") {
                                console.log("cast du champ " + fieldPostType.name + " en type Date")
                                newPost[fieldPostType.name] = new Date(newPost[fieldPostType.name])
                            } else {
                                console.log("Pas de type définit : cast du champ " + fieldPostType.name + " en type String")
                                newPost[fieldPostType.name] = String(newPost[fieldPostType.name])
                            }
                        }
                    }
                } else {
                    console.log("[WARNING] no post type found for id " + post.postTypeId)
                }

                console.log("newPost")
                console.log(newPost)

                // Update the post
                data._posts.update({ _id: postId }, { $set: newPost },
                    (err, num) => {
                        if (num)
                            res.send({ message: "success : post saved" });
                        else
                            res.send({ message: "database error : impossible to save post" });
                        console.log("[DEBUG] post (" + postId + ") saved " + num)
                    });

            })


        } else {
            console.log("[WARNING] no post type found for id " + postId)
        }
    });



}

// Remove a post of a custom type
function remove(req, res) {
    var postId = req.params.postId;

    data._posts.remove({ _id: postId }, (err, num) => {
        if (num) {
            res.send({ message: "success : post deleted" + num });
        } else {
            res.send({ message: "internal error : impossible to delete post" });
        }
        console.log("[DEBUG] post (" + postId + ") deleted " + num)
    });
}



module.exports = postController;