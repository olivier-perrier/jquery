
var data = require('../../models/data')

var aboutPage = require('./aboutPage')

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

  // Post.getPostByName(
  //   {
  //     title: "Hello World",
  //     name: "hello-world",
  //     content: `Welcome to OP CMS. This is your first post. Edit or delete it, then start writing !`,
  //     image: "banner.jpg",
  //     category: "uncategorized",
  //     tags: ["presentation", "website", "OP cms"],
  //     status: "publish",
  //   }, (err, post) => {
  //     console.log("[INFO] default post created")
  //   })


  data.customType.remove({}, { multi: true })

  data.customType.insert({
    name: "posts",
    label: "Posts",
    icon: "far fa-envelope-open",
    properties: {
      _id: { type: "hidden" },
      title: { type: "autokey", main: 1 },
      name: { type: "string" },
      authorId: { type: "relationship", path: "users", refpath: "username" },
      state: { type: "string" },
      image: { type: "string" },
      content: { type: "string" },
      description: { type: "string" },
      categories: { type: "string" },
      format: { type: "string" },
      tags: { type: "string" },
      createdAt: { type: "string" },
      updatedAt: { type: "string" },
    },
    columns: ["title", "authorId", "categories", "tags", "createdAt"],
    order: 1,

  }, (err, post) => {
    console.log("Custom type inserted posts")
  })

  
  // data.customType.insert({
  //   name: "categories",
  //   label: "Categories",
  //   icon: "far fa-envelope-open",
  //   properties: {
  //     _id: { type: "hidden" },
  //     title: { type: "autokey", main: 1 },
  //     name: { type: "string" },
  //   },
  //   columns: ["title", "name"],
  //   parent: "posts",
  //   order: 1,

  // }, (err, post) => {
  //   console.log("Custom type inserted categories")
  // })
  

  data.customType.insert({
    name: "menus",
    label: "Menus",
    icon: "far fa-compass",
    properties: {
      _id: { type: "hidden" },
      title: { type: "autokey", main: 1 },
      type: { type: "string" },
      target: { type: "string" },
      order: { type: "string" },
      parent: { type: "relationship", path: "menus", refpath: "title" },
    },
    columns: ["title", "type", "target", "order"],
    order: 2,

  }, (err, post) => {
    console.log("Custom type inserted menus")
  })

  data.customType.insert({
    name: "pages",
    label: "Pages",
    icon: "far fa-file",
    properties: {
      _id: { type: "hidden" },
      title: { type: "autokey", main: 1 },
      content: { type: "string" },
      state: { type: "string" },
      authorId: { type: "relationship", path: "users", refpath: "username" },
      createdAt: { type: "string" }
    },
    columns: ["title", "state", "authorId"],
    order: 1,
  }, (err, post) => {
    console.log("Custom type inserted pages")
  })

  data.customType.insert({
    name: "users",
    label: "Users",
    icon: "far fa-user",
    properties: {
      _id: { type: "hidden" },
      username: { type: "autokey", main: 1 },
      firstname: { type: "string" },
      lastname: { type: "string" },
      email: { type: "string" },
      password: { type: "string" },
      role: { type: "string" },
      posts: { type: "relationship", path: "posts", refpath: "name" },
    },
    columns: ["username", "email", "role", "posts"],
    order: 3
  }, (err, post) => {
    console.log("Custom type inserted users")
  })

  data.customType.insert({
    name: "comments",
    label: "Comments",
    icon: "far fa-comment",
    properties: {
      _id: { type: "autokey", main: 1 },
      content: { type: "string" },
      state: { type: "string" },
      postId: { type: "relationship", path: "posts", refpath: "name" },
      authorId: { type: "relationship", path: "users", refpath: "username" },
      createdAt: { type: "string" }
    },
    columns: ["_id", "state", "authorId"],
    order: 8
  }, (err, post) => {
    console.log("Custom type inserted comments")
  })

  data.customType.insert({
    name: "widgets",
    label: "Widgets",
    icon: "fas fa-puzzle-piece",
    properties: {
      _id: { type: "hidden" },
      name: { type: "autokey" },
      state: { type: "string" },
      configuration: { type: "string" },
    },
    columns: ["name", "state"],
    order: 10
  }, (err, post) => {
    console.log("Custom type inserted widgets")
  })

  data.customType.insert({
    name: "medias",
    label: "Medias",
    icon: "far fa-images",
    properties: {
      _id: { type: "hidden" },
      name: { type: "autokey", autokey: true },
      image: { type: "image" },
      createdAt: { type: "string" },
    },
    columns: ["name", "image"],
    order: 12
  }, (err, post) => {
    console.log("Custom type inserted medias")
  })

  data.customType.insert({
    name: "settings",
    label: "Settings",
    icon: "fas fa-sliders-h",
    properties: {
      _id: { type: "hidden" },
      name: { type: "autokey", autokey: true },
      value: { type: "string" },
    },
    columns: ["name", "value"],
    order: 15
  }, (err, post) => {
    console.log("Custom type inserted settings")
  })

}

exports.createDatas = () => {

  data.menus.remove({}, { multi: true })

  // Create default menu Posts
  data.menus.insert({
    title: "Posts",
    name: "posts",
    type: "posts",
    target: "/posts",
    order: 1
  }, (err, post) => {
    console.log("[INFO] default menu posts")
  })

  // Create default menu Hello Word
  data.menus.insert({
    title: "Hello world",
    name: "hello-world",
    type: "posts",
    target: "/posts/hello-world",
    order: 2
  }, (err, post) => {
    console.log("[INFO] default menu created")
  })

  // Create default menu Hello Word
  data.menus.insert({
    title: "My category",
    name: "my-category",
    type: "categories",
    target: "/posts?categories=cat",
    order: 3
  }, (err, post) => {
    console.log("[INFO] default menu created")
  })


  // Create default menu Google
  data.menus.insert({
    title: "Google",
    name: "google",
    type: "direct",
    target: "http://www.google.fr",
    order: 5
  }, (err, post) => {
    console.log("[INFO] default menu created")
  })

  // Create default menu About
  data.menus.insert({
    title: "About",
    name: "about",
    type: "pages",
    target: "pages/about",
    order: 10
  }, (err, post) => {
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
