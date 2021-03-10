var data = require("../components/data.js");

var postTypeController = {
    index,
    indexPost,
    show,
    create,
    store,
    remove
}

function index(req, res) {

    data.customTypes.find({}).sort({ order: 1 }).exec((err, posts) => {
        if (posts) {
            console.log("[DEBUG] post types found " + posts.length);
            res.send({ message: "success : post types found", posts });
        } else {
            res.send({ message: "no post types found" });
        }
    });
}

// Get all posts for a custom type
function indexPost(req, res) {
    var postTypeId = req.params.postTypeId;

    var sort = req.query.sort
    var query = req.query.query || ""

    // Met en forme la query en json pour la base de données
    var pasedQuery = JSON.parse("{ " + query + " }")

    data._posts.find({ postTypeId: postTypeId }).sort({ [sort]: 1 }).exec((err, posts) => {
        if (posts) {
            // Caster les types pour l'envoie au client
            console.log("[DEBUG] posts (" + postTypeId + ") found " + posts.length);
            res.send({ message: "success : posts found", posts });
        } else {
            res.send({ message: "no post found for post type id " + postTypeId });
        }
    });
}

function show(req, res) {
    var postTypeId = req.params.postTypeId

    data.customTypes.findOne({ _id: postTypeId }, (err, post) => {
        if (post) {

            //Disable the updated and created fields
            try {
                if (post.setting) {
                    (post.setting.find(e => e.name == "createdAt") || {}).disabled = true;
                    (post.setting.find(e => e.name == "updatedAt") || {}).disabled = true;
                }
            } catch (error) {
                console.log("[WARNING] impossible to set created at updated date to disabled")
            }

            res.send({ message: "success : post type found", post });

        } else {
            res.send({ message: "not found : post type not existing for id " + postTypeId });
        }
    })
}

// Update a post of a custom type
function store(req, res) {
    var postTypeId = req.params.postTypeId

    var newPost = req.body.post

    newPost = newPost || {}
    newPost.updatedAt = new Date()
    newPost.createdAt = newPost.createdAt || new Date()

    // console.log("newPost before cast")
    // console.log(newPost)

    // Cast les attributs
    data.customTypes.findOne({ _id: postTypeId }, (err, post) => {
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
                data.customTypes.update({ _id: postTypeId }, { $set: newPost },
                    (err, num) => {
                        if (num)
                            res.send({ message: "success : post saved" });
                        else
                            res.send({ message: "database error : impossible to save post" });
                        console.log("[DEBUG] post (" + postTypeId + ") saved " + num)
                    });

            })


        } else {
            console.log("[WARNING] no post type found for id " + postTypeId);
            res.send({ message: "not found : no post type found for id " + postTypeId });
        }
    });



}

// Create a post of the custom type
function create(req, res) {
    var postTypeId = req.query.postTypeId;
    var newPost = req.body.customType;

    newPost = newPost || {}

    newPost.postTypeId = postTypeId;
    newPost.createdAt = new Date();

    data.customTypes.insert(newPost, (err, post) => {
        if (post) {
            res.send({ message: "success : post created", post });
        } else {
            res.send({ message: "database error : impossible to create post" });
        }
        console.log("[DEBUG] post (" + postTypeId + ") created " + post._id)
    });
}

// Remove a post of a custom type
function remove(req, res) {
    var postTypeId = req.params.postTypeId;

    data.customTypes.remove({ _id: postTypeId }, (err, num) => {
        if (num) {
            res.send({ message: "success : posttype deleted" + num });
        } else {
            res.send({ message: "not found : impossible to delete posttype for id " + postTypeId});
        }
        console.log("[DEBUG] post (" + postTypeId + ") deleted " + num)
    });
}

module.exports = postTypeController;