var data = require("../components/data.js");

var publicController = {
    getMenus,
}

// Get all posts for a custom type
function getMenus(req, res) {
    if (data.menus) {
        data.menus.find({}).sort({ order: 1 }).exec((err, posts) => {

            if (posts) {
                posts.forEach(post => {
                    if (post.postType)
                        post.link = '/' + post.postType.name + '/' + post.link
                    else
                        post.link = '/'
                });
            }
            res.send({ message: "success : posts found", posts });
            console.log("[DEBUG] public menus sent" + posts.length)
        });
    } else {
        res.send({ message: "not found : no database found for menus" });
    }
}

module.exports = publicController;
