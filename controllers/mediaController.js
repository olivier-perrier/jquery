var data = require("../components/data.js");

var mediaController = {
    upload,
}

// Upload a file
function upload(req, res) {
    var postType = req.body.postType;

    let sampleFile = req.files.file;

    sampleFile.mv("./public/medias/" + postType + "/" + sampleFile.name, function (err) {
        if (err) {
            console.log("[ERROR] moving uploaded file " + err);
            res.send({
                message: "[ERROR] impossible to move file " + sampleFile.name
            });
        } else {
            console.log("[DEBUG] media moved succefully " + sampleFile.name);
            res.send({ message: "success : media uploaded " + sampleFile.name });
        }
    });
}

module.exports = mediaController;
