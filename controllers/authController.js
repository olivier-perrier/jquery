var data = require("../components/data.js");

var postController = {
    login,
    register,
    logout
}

function login(req, res) {
    var loginUser = req.body.user || {};

    data.users.findOne(
        { email: loginUser.email, password: loginUser.password },
        (err, user) => {
            if (user) {
                req.session.userId = user._id;
                req.session.userRole = user.role;
                req.session.userName = user.firstName;
                res.send({ message: "success : loggin ", user: user });
                console.log("[DEBUG] login user " + user._id)
            } else {
                res.send({ message: "not found : unknow username or password" });
                console.log("[DEBUG] login user not found " + loginUser.email + " " + loginUser.password)
            }
        }
    );
}

// TODO
function register(req, res) {
    var user = req.body.user;

    data.users.findOne({ name: user.userName }, (err, user) => {
        if (user) {
            res.send({ message: "forbidden : user not available" });
        } else {
            data.users.insert(user, (err, user) => {
                res.send({ message: "success : user created", user: user });
            });
        }
    });
}

function logout(req, res) {
    req.session.userId = null;
    res.send({ message: "success : user logout" });
}


module.exports = postController;