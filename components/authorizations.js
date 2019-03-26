
var data = require('../models/data')
var User = data.model('User')

exports.requireAuthentication = (req, res, next) => {

  console.log("[DEBUG] " + req.method + " " + req.baseUrl + req.path)

  var userRole = req.session.userRole

  if (req.session.userRole == "admin")
    next()
  else {


    var routeAccess = defineRouteAccess.find(routeAccess => {
      return routeAccess.method == req.method && routeAccess.route == req.baseUrl + req.path
    })

    if (routeAccess) {

      if (routeAccess.autorisation.includes(userRole)) {
        next()
      } else {
        console.log("[WARNING] attenting access not autorised adress: " + req.baseUrl + req.path + " role: " + userRole)
        next()
        // res.status(403).send({ message: "forbidden : you do not have the autorisation" })
      }

    } else {
      next()
    }
  }

}

/**
 * Auto loggin the Olivier admin user
 */
exports.loadUser = (req, res, next) => {

  if (process.env.NODE_ENV == 'dev') {
    data.users.findOne({ name: "Olivier" }, (err, user) => {
      if (user) {
        console.log("[DEBUG] auto login")
        req.session.userId = user._id
        req.session.userRole = user.role
      }
      next()
    })
  } else
    next()


}


var defineRouteAccess = [

  // Admin
  { method: "GET", route: "/admin", autorisation: ["admin"] },

  { method: "GET", route: "/admin/posts", autorisation: ["admin"] },
  { method: "GET", route: "/admin/posts/edit/:", autorisation: ["admin"] },

  { method: "GET", route: "/admin/pages", autorisation: ["admin"] },
  { method: "GET", route: "/admin/pages/edit/:", autorisation: ["admin"] },

  { method: "GET", route: "/admin/menus", autorisation: ["admin", "author"] },
  { method: "GET", route: "/admin/menus/edit/:", autorisation: ["admin"] },

  { method: "GET", route: "/admin/users", autorisation: ["admin"] },
  { method: "GET", route: "/admin/users/edit/:", autorisation: ["admin"] },

  { method: "GET", route: "/admin/medias", autorisation: ["admin", "author"] },

  { method: "GET", route: "/admin/comments", autorisation: ["admin", "author", "subscriber"] },
  { method: "GET", route: "/admin/comments/edit/:", autorisation: ["admin", "author", "subscriber"] },

  { method: "GET", route: "/admin/widgets", autorisation: ["admin"] },

  { method: "GET", route: "/admin/settings", autorisation: ["admin"] },

  // API
  { method: "POST", route: "/API/posts/:", autorisation: ["admin"] },
  { method: "POST", route: "/API/pages/:", autorisation: ["admin"] },
  { method: "POST", route: "/API/menus/:", autorisation: ["admin"] },
  { method: "POST", route: "/API/users/:", autorisation: ["admin"] },
  { method: "POST", route: "/API/medias/:", autorisation: ["admin"] },
  { method: "POST", route: "/API/comments/:", autorisation: ["admin", "author", "subscriber"] },

  { method: "POST", route: "/API/posts/create", autorisation: ["admin", "author"] },
  { method: "POST", route: "/API/post/save", autorisation: ["admin", "author"] },
  { method: "POST", route: "/API/posts/delete", autorisation: ["admin"] },

  { method: "POST", route: "/API/pages/create", autorisation: ["admin"] },
  { method: "POST", route: "/API/pages/save", autorisation: ["admin"] },
  { method: "POST", route: "/API/pages/delete", autorisation: ["admin"] },


  { method: "POST", route: "/API/comments/delete", autorisation: ["admin", "author"] },
  { method: "POST", route: "/API/settings/save", autorisation: ["admin"] },

  { method: "GET", route: "/API/posts", autorisation: ["public"] },
  { method: "GET", route: "/API/categories", autorisation: ["public"] },
  { method: "GET", route: "/API/comments", autorisation: ["public"] },
]
