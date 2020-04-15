
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
 * L'utilisateur est admit s'il est administrateur
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

  console.log("[AUTORISATION] " + req.method + " " + req.baseUrl + req.path)

  var userRole = req.session.userRole

  if (req.session.userRole == "admin" || process.env.NODE_ENV == "dev") {
    next()
  } else {
    console.log("[AUTHORISATION] user with role (" + userRole + ") not allowed")
    res.status(403).send({ message: "[AUTHORISATION] : forbiden you do not have the autorisation or login" })


    // TODO pour un systeme d'autorisations plus poussé.
    // console.log("req.baseUrl " + req.baseUrl)

    // routeAcces = routesAcces[req.method + " " + req.baseUrl]

    // console.log("routeAcces " + routeAcces)

    // if (routeAcces.includes(req.session.userRole))
    //   next()
    // else
    //   res.status(403).send({ message: "[AUTHORISATION] : forbiden you do not have the autorisation or login" })

  }
}



var routesAcces = {

  // GET
  "GET /API/post": ["admin", "reporter"],


  "GET /API/admin/:": ["admin", "reporter"],
  "GET /API/admin/customTypes": ["admin"],

  // POST
  "POST API/admin/:": ["admin", "reporter"],
  "POST API/admin/customTypes:": ["admin"],

  "POST API/admin/menus/:": ["admin"],
  "POST API/admin/users/:": ["admin"],
  "POST API/admin/medias/:": ["admin"],


  "POST API/admin/settings": ["admin"],
  "POST API/admin/settings/:": ["admin"],

}
