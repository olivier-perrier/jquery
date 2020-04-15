
var db = require('../components/data')

/***
 * Autorisation des API et autorisation des vues (l'autorisation des vues est surement à faire dans le coté client avec vuejs)
 * 
 * Autorisation des API
 * 
 * Public / privé
 * 
 * Public : un chemin est public ce que signit qu'il est accéssible sans aucun control
 * 
 * Privé : un chemin est privé ce qui signit qu'il fait appel au composant des autorisations
 * 
 * ADMIN : le profil admin donne droit d'accès à toutes les API (admin et client)
 * REPORTER : le profile reporter donne droit d'accès à toutes les API client et doit d'accès aux API admin sauf des types paramétres
 * USER : le profil user donne droit d'accès à toutes les API client
 * 
 * Si l'utilisateur est admin alors il à toujours accès à tout
 * 
 * Si une règle n'est pas définit alors 
 *    Si la route est cliente alors l'accès est intégrale 
 *    Si la route est admin
 *        l'accès en GET est intégrale à part pour settings, users, et customTypes
 *        l'ccès en POST est jamais possible
 * 
 */

exports.requireAuthentication = (req, res, next) => {

  console.log("[AUTORISATION] " + req.method + " " + req.baseUrl + " " + req.path)

  var userRole = req.session.userRole

  if (req.session.userRole == "admin") {
    console.log("[AUTORISATION] admin allowed")
    next()
  } else {


    var routeAccess = defineRouteAccess.find(routeAccess => {
      return routeAccess.method == req.method && routeAccess.route == req.baseUrl + req.path
    })

    if (routeAccess) {

      if (routeAccess.autorisation.includes(userRole)) {
        console.log("[AUTORISATION] user with role " + userRole + " allowed for route " + req.baseUrl + req.path)
        next()
      } else {
        console.log("[AUTORISATION] WARNING attenting access not autorised address: " + req.baseUrl + req.path + " role: " + userRole)
        next()
        // res.status(403).send({ message: "forbidden : you do not have the autorisation" })
      }

    } else {
      console.log("[AUTORISATION] WARNING no route acces difined for " + req.method + " " + req.baseUrl + req.path)
      next()
    }
  }

}


var defineRouteAccess = [

  // GET
  { method: "GET", route: "/API/admin/:", autorisation: ["admin", "reporter"] },
  { method: "GET", route: "/API/admin/customTypes", autorisation: ["admin"] },

  // API
  { method: "POST", route: "/API/admin/:", autorisation: ["admin", "reporter"] },
  { method: "POST", route: "/API/admin/customTypes:", autorisation: ["admin"] },

  { method: "POST", route: "/API/admin/menus/:", autorisation: ["admin"] },
  { method: "POST", route: "/API/admin/users/:", autorisation: ["admin"] },
  { method: "POST", route: "/API/admin/medias/:", autorisation: ["admin"] },


  { method: "POST", route: "/API/admin/settings", autorisation: ["admin"] },
  { method: "POST", route: "/API/admin/settings/:", autorisation: ["admin"] },

  //Test
  { method: "POST", route: "/API/settings", autorisation: ["admin"] },


]
