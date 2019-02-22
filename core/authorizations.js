
console.log("Authorizations defining...")

var defineRouteAccess = [

  { method: "GET", route: "/", autorisation: ["public"] },
  { method: "GET", route: "/posts", autorisation: ["public"] },
  { method: "GET", route: "/posts/:", autorisation: ["public"] },
  { method: "GET", route: "/pages/:", autorisation: ["public"] },
  { method: "GET", route: "/categories/:", autorisation: ["public"] },

  { method: "GET", route: "/login", autorisation: ["public"] },
  { method: "GET", route: "/logout", autorisation: ["public"] },
  { method: "GET", route: "/signup", autorisation: ["public"] },

  // Admin
  { method: "GET", route: "/admin/", autorisation: ["admin"] },

  { method: "GET", route: "/admin/posts", autorisation: ["admin"] },
  { method: "GET", route: "/admin/posts/edit/:", autorisation: ["admin"] },

  { method: "GET", route: "/admin/pages", autorisation: ["admin"] },
  { method: "GET", route: "/admin/pages/edit/:", autorisation: ["admin"] },

  { method: "GET", route: "/admin/menus", autorisation: ["admin", "author"] },
  { method: "GET", route: "/admin/menus/edit/:", autorisation: ["admin"] },

  { method: "GET", route: "/admin/users", autorisation: ["admin"] },
  { method: "GET", route: "/admin/users/edit/:", autorisation: ["admin"] },

  { method: "GET", route: "/admin/medias", autorisation: ["author"] },

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

exports.checkAuthorizations = (req, res, next) => {

  console.log("[DEBUG] " + req.method + " " + req.baseUrl + req.path)

  // DEBUG AUTO DEFINE ADMIN ROLE
  if (process.env.NODE_ENV == 'dev') {
    console.log("[DEBUG] set default role admin")
    req.session.userRole = "admin"
  }

  var routeAccess = defineRouteAccess.find(routeAccess => {
    return routeAccess.method == req.method && routeAccess.route == req.baseUrl + req.path
  })

  if (routeAccess == null) {
    routeAccess = defineRouteAccess.find(routeAccess => {
      return routeAccess.route.includes(":") &&
        routeAccess.method == req.method &&
        req.originalUrl.includes(routeAccess.route.replace(":", ""))
    })
  }

  if (routeAccess) {

    console.log("[DEBUG] route access autorisation " + routeAccess.method + " " + routeAccess.route + " " + routeAccess.autorisation)

    var userRole = req.session.userRole

    if (userRole) {
      if (routeAccess.autorisation == "public" || routeAccess.autorisation.includes(userRole)) {
        next()
      } else {
        console.log("[WARNING] attenting access not autorised API " + req.baseUrl + req.path)
        res.status(403).send({ message: "forbidden : you do not have the autorisation" })
      }
    } else {
      console.log("[WARNING] no user role defined")
      res.redirect("/login")
    }

  } else {
    console.log("[WARNING] no security route autorisation defined for " + req.baseUrl + req.path)
    //DEBUG autorise la route si elle n'est pas definit
    next()
  }


}