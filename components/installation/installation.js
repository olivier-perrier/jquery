
var data = require('../../models/data')

var aboutPage = require('./aboutPage')
var helloPost = require('./helloPost')

exports.createModels = (req, res, next) => {

  console.log("[INFO] Installation...")

  // // Create default user
  // data.users.findOne({ username: "Olivier" }, (err, user) => {
  //   if (!user)
  //     User.create({
  //       username: "Olivier",
  //       role: "admin",
  //       email: "leperenoel38@hotmail.fr",
  //       password: "123"
  //     }, (err, user) => {
  //       console.log("[INFO] default user created")
  //     })
  // })

  // // Create default page About
  // User.getByName("Olivier", (err, user) => {
  //   if (user) {
  //     aboutPage.authorId = user._id
  //     Post.getPageByName(aboutPage.name, (err, post) => {
  //       if (!post)
  //         Post.createPage(aboutPage, (err, page) => {
  //           if (page)
  //             console.log("[INFO] default page created")
  //         })
  //     })
  //   }
  // })

  // // Create default post Hello World
  // User.getByName("Olivier", (err, user) => {
  //   if (user) {
  //     helloPost.authorId = user._id

  //     Post.getPostByName(helloPost.name, (err, post) => {
  //       if (!post)
  //         Post.createPost(helloPost, (err, post) => {
  //           console.log("[INFO] default post created")
  //         })
  //     })
  //   }
  // })

  // // Create default menu Google
  // Post.getMenuByName("google", (err, menu) => {
  //   if (!menu)
  //     Post.createMenu({
  //       title: "Google",
  //       name: "google",
  //       format: "direct",
  //       content: "www.google.fr",
  //       order: 3
  //     }, (err, menu) => {
  //       if (menu)
  //         console.log("[INFO] default menu created")
  //     })
  // })

  // // Create default menu  About
  // Post.getMenuByName("about", (err, menu) => {
  //   if (!menu)
  //     Post.createMenu({
  //       title: "About",
  //       name: "about",
  //       format: "pages",
  //       content: "about",
  //       order: 10
  //     }, (err, menu) => {
  //       console.log("[INFO] default menu created")
  //     })
  // })

  // // Create default menu Hello World
  // Post.getMenuByName("hello-world", (err, menu) => {
  //   if (!menu)
  //     Post.createMenu({
  //       title: "Hello World",
  //       name: "hello-world",
  //       format: "posts",
  //       content: "hello-world",
  //       order: 1,
  //     }, (err, menu) => {
  //       if (menu)
  //         console.log("[INFO] default menu created")
  //     })
  // })

  data.customType.remove({}, { multi: true })

  data.customType.insert({
    name: "menus",
    label: "Menus",
    icon: "far fa-compass",
    properties: {
      _id: { type: "hidden" },
      title: { type: "string", autokey: true, main: 1 },
      type: { type: "string" },
      target: { type: "string" },
      order: { type: "string" },
      parent: { type: "relationship", path: "menus", refpath: "title" },
    },
    columns: ["title", "type", "target", "order"]
  }, (err, post) => {
    console.log("Custom type inserted menus")
  })

  data.customType.insert({
    name: "pages",
    label: "Pages",
    icon: "far fa-file",
    properties: {
      _id: { type: "hidden" },
      title: { type: "string", autokey: true, main: 1 },
      content: { type: "string" },
      state: { type: "string" },
      authorId: { type: "relationship", path: "users", refpath: "username" },
      createdAt: { type: "string" }
    },
    columns: ["title", "state", "authorId"]
  }, (err, post) => {
    console.log("Custom type inserted pages")
  })

  data.customType.insert({
    name: "users",
    label: "Users",
    icon: "far fa-user",
    properties: {
      _id: { type: "hidden" },
      username: { type: "string", autokey: true, main: 1 },
      firstname: { type: "string" },
      lastname: { type: "string" },
      email: { type: "string" },
      password: { type: "string" },
      role: { type: "string" },
      posts: { type: "relationship", path: "posts", refpath: "name" },
    },
    columns: ["username", "email", "role", "posts"]
  }, (err, post) => {
    console.log("Custom type inserted users")
  })

  data.customType.insert({
    name: "comments",
    label: "Comments",
    icon: "far fa-comment",
    properties: {
      _id: { type: "string", autokey: true, main: 1 },
      content: { type: "string" },
      state: { type: "string" },
      postId: { type: "relationship", path: "posts", refpath: "name" },
      authorId: { type: "relationship", path: "users", refpath: "username" },
      createdAt: { type: "string" }
    },
    columns: ["_id", "state", "authorId"]
  }, (err, post) => {
    console.log("Custom type inserted comments")
  })

  data.customType.insert({
    name: "widgets",
    label: "Widgets",
    icon: "fas fa-puzzle-piece",
    properties: {
      name: { type: "string" },
      state: { type: "string" },
      configuration: { type: "string" },
    },
    columns: ["name", "state"]
  }, (err, post) => {
    console.log("Custom type inserted widgets")
  })



}

exports.createDatas = () => {

  data.users.find({}, (err, posts) => {
    
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
