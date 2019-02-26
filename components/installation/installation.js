
var data = require('../../models/data')
var User = data.model('User')
var Post = data.model('Post')

var aboutPage = require('./aboutPage')
var helloPost = require('./helloPost')

exports.createModels = (req, res, next) => {

  console.log("[INFO] Installation...")

  // Create default user
  User.create({
    username: "Olivier",
    role: "admin",
    email: "leperenoel38@hotmail.fr",
    password: "123"
  }, (err, user) => {
    if (user) console.log("[INFO] default user created")
  })

  // Create default page About
  User.getByName("Olivier", (err, user) => {
    if (user) {
      aboutPage.authorId = user._id
      Post.createPage(aboutPage, (err, page) => {
        if (page)
          console.log("[INFO] default page created")
      })
    }
  })

  // Create default post Hello World
  User.getByName("Olivier", (err, user) => {
    if (user) {
      helloPost.authorId = user._id
      Post.createPost(helloPost, (err, post) => {
        if (post)
          console.log("[INFO] default post created")
      })
    }
  })

  // Create default menu Google
  Post.createMenu({
    title: "Google",
    name: "google",
    format: "direct",
    content: "www.google.fr"
  }, (err, menu) => {
    if (menu)
      console.log("[INFO] default menu created")
  })

  // Create default menu About
  Post.createMenu({
    title: "About",
    name: "about",
    format: "pages",
    content: "about"
  }, (err, menu) => {
    if (menu)
      console.log("[INFO] default menu created")
  })

  // Create default menu Hello World
  Post.createMenu({
    title: "Hello World",
    name: "hello-world",
    format: "posts",
    content: "hello-world"
  }, (err, menu) => {
    if (menu)
      console.log("[INFO] default menu created")
  })



}


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
