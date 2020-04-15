var data = require("../components/data.js");

var postController = {
    get,
    create,
    getById,
    getByName,
    update,
    remove
}

// Get all posts for a custom type
function get(req, res) {
    var postTypeName = req.params.postTypeName;

    var sort = req.query.sort
    var query = req.query.query || ""

    // Met en forme la query en json pour la base de données
    var pasedQuery = JSON.parse("{ " + query + " }")

    if (data[postTypeName]) {
        data[postTypeName].find(pasedQuery).sort({ [sort]: 1 }).exec((err, posts) => {
            if(posts){
                // Caster les types pour l'envoie au client
            }
            res.send({ message: "success : posts found", posts });
            console.log("[DEBUG] posts (" + postTypeName + ") found " + posts.length)
        });
    } else {
        res.send({ message: "not found : postType not existing " + postTypeName });
    }
}

// get a post of a custom type with the Id
function getById(req, res) {
    var postTypeName = req.params.postTypeName
    var postId = req.params.postId

    // if (postTypeName == "customType")
    // postController.getCustomTypeByName(req, res, next)

    // Set settings

    data[postTypeName].findOne({ _id: postId }, (err, post) => {
        res.send({ message: "success : post found", post })
    })
}

// Pour l'instant réservé pour la récupération du type paramétré 
// NE DOIT PAS ETRE UTILISe POUR RECUPERATION D UN AUTRE TYPE DE POST
function getByName(req, res) {
    var postTypeName = req.params.postTypeName;
    var customTypeName = req.params.customTypeName;

    data[postTypeName].findOne({ name: customTypeName }, (err, post) => {
        if (post) {

            //Parse the settings
            try {
                post.setting = JSON.parse(post.setting);
            } catch (error) {
                console.log("[WARNING] impossible to parse JSON " + post.setting)
            }

            //Disable the updated and created fields
            try {
                if (post.setting) {
                    (post.setting.find(e => e.name == "createdAt") || {}).disabled = true;
                    (post.setting.find(e => e.name == "updatedAt") || {}).disabled = true;
                }
            } catch (error) {
                console.log("[WARNING] impossible to set created at updated date to disabled")
            }

            res.send({ message: "success : custom type found", post });
        } else {
            res.send({ message: "not found : custom type not existing for name " + customTypeName });
        }
    });
}

// Create a post of the custom type
function create(req, res) {
    var postTypeName = req.params.postTypeName;
    var newPost = req.body.customType;

    newPost = newPost || {}

    newPost.createdAt = new Date();

    data[postTypeName].insert(newPost, (err, post) => {
        if (post) {
            res.send({ message: "success : post created", post });
        } else {
            res.send({ message: "database error : impossible to create post" });
        }
        console.log("[DEBUG] post (" + postTypeName + ") created " + post._id)
    });
}

// Update a post of a custom type
function update(req, res) {
    var postTypeName = req.params.postTypeName;
    var postId = req.params.postId

    var newPost = req.body.post

    newPost = newPost || {}
    newPost.updatedAt = new Date()
    newPost.createdAt = newPost.createdAt || new Date()

    console.log("newPost before cast")
    console.log(newPost)
    // Cast les attributs
    data.customTypes.findOne({ name: postTypeName }, (err, postType) => {
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
                    }else {
                        console.log("Pas de type définit : cast du champ " + fieldPostType.name + " en type String")
                        newPost[fieldPostType.name] = String(newPost[fieldPostType.name])
                    }
                }
            }
        } else {
            console.log("[WARNING] no post type found for name " + postTypeName)
        }

        console.log("newPost")
        console.log(newPost)



        // Update the post
        data[postTypeName].update({ _id: postId }, { $set: newPost },
            (err, num) => {
                if (num)
                    res.send({ message: "success : post saved" });
                else
                    res.send({ message: "database error : impossible to save post" });
                console.log("[DEBUG] post (" + postTypeName + ") saved " + num)
            });


    })
}

// Remove a post of a custom type
function remove(req, res) {
    var postTypeName = req.params.postTypeName;
    var postId = req.params.postId;

    // var postId = req.body.postId;

    data[postTypeName].remove({ _id: postId }, (err, num) => {
        if (num) {
            res.send({ message: "success : post deleted" + num });
        } else {
            res.send({ message: "internal error : impossible to delete post" });
        }
        console.log("[DEBUG] post (" + postTypeName + ") deleted " + num)
    });
}



module.exports = postController;