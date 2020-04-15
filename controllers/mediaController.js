var data = require("../components/data.js");

var mediaController = {
    upload,
}

// Upload a file
function upload(req, res) {
    var customType = req.params.customType;
    var customType = "users";

    console.log(req.files);

    let sampleFile = req.files.file;

    var fileName = sampleFile.name;

    sampleFile.mv("./public/medias/" + customType + sampleFile.name, function (err) {
        if (err) {
            console.log("[ERROR] moving uploaded file " + err);
            res.send({
                message: "internal error : error moving the file " + sampleFile.name
            });
        } else {
            console.log("media moved");
            data[customType].update({}, { image: fileName }, (err, num) => {
                console.log("media updated " + num);

                if (num) res.send({ message: "success : media created " + sampleFile });
                else
                    res.send({
                        message: "internal error : impossible to save create " + sampleFile
                    });
            });
        }
    });
}

module.exports = mediaController;
