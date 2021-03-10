var data = require("../components/data.js");

var publicController = {
    getMenus,
}

// Get all posts for a custom type
function getMenus(req, res) {

    data.customTypes.findOne({ name: "menus" }).sort({ order: 1 }).exec((err, posttype) => {

        if (posttype) {

            data._posts.find({ postTypeId: posttype._id }).sort({ order: 1 }).exec((err, posts) => {
                if (posts) {
                    res.send({ message: "success : posts found", posts });
                } else {
                    res.send({ message: "not found : no menus found for postTypeId " + posttype._id });
                }

            });

        } else {
            res.send({ message: "not found : no posttype found for menus" });
        }
    });

}

module.exports = publicController;
