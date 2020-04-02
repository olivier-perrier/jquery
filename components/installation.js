console.log("[INFO] Installation...")

var data = require('../models/data.js')

exports.createModels = (req, res, next) => {

  console.log("[INFO] installings models...")

  // TODO vérifier si les types de bases existent sinon les créer

  data.customTypes.insert({
    name: "posts2",
    label: "Posts",
    icon: "far fa-envelope-open",
    settings: {
      title: { type: "string", autokey: true, main: 1 },
      name: { type: "string" },
      authorId: { type: "relationship", path: "users", refpath: "username" },
      state: { type: "select", options: ["publish", "draft", "trash"] },
      image: { type: "image" },
      content: { type: "textarea", rows: 10 },
      categories: { type: "string" },
      tags: { type: "string" },
      createdAt: { type: "date", protected: true },
      updatedAt: { type: "date", protected: true },
    },
    columns: ["title", "authorId", "categories", "tags", "createdAt"],
    order: 1,

  }, (err, post) => {
    console.log("Custom type inserted posts")
  })

  // data.customTypes.insert({
  //   name: "menus",
  //   label: "Menus",
  //   icon: "far fa-compass",
  //   properties: {
  //     title: { type: "string", autokey: true, main: 1 },
  //     type: { type: "string" },
  //     target: { type: "string" },
  //     order: { type: "string" },
  //     parent: { type: "relationship", path: "menus", refpath: "title" },
  //   },
  //   columns: ["title", "type", "target", "order"],
  //   order: 2,

  // }, (err, post) => {
  //   console.log("Custom type inserted menus")
  // })

  // data.customTypes.insert({
  //   name: "pages",
  //   label: "Pages",
  //   icon: "far fa-file",
  //   properties: {
  //     title: { type: "string", autokey: 1, main: 1 },
  //     content: { type: "textarea", rows: 20 },
  //     state: { type: "select", options: ['draft', 'published', 'archived'] },
  //     authorId: { type: "relationship", path: "users", refpath: "username" },
  //     createdAt: { type: "date", protected: true }
  //   },
  //   columns: ["title", "state", "authorId"],
  //   order: 1,
  // }, (err, post) => {
  //   console.log("Custom type inserted pages")
  // })

  // data.customTypes.insert({
  //   name: "users",
  //   label: "Users",
  //   icon: "far fa-user",
  //   properties: {
  //     name: { type: "string", autokey: true, main: 1 },
  //     firstname: { type: "string" },
  //     lastname: { type: "string" },
  //     email: { type: "string" },
  //     password: { type: "password" },
  //     role: { type: "select", options: ["admin", "reporter", "user"] },
  //   },
  //   columns: ["name", "email", "role"],
  //   order: 3
  // }, (err, post) => {
  //   console.log("Custom type inserted users")
  // })

  // data.customTypes.insert({
  //   name: "comments",
  //   label: "Comments",
  //   icon: "far fa-comment",
  //   properties: {
  //     _id: { type: "string", autokey: true, main: 1 },
  //     content: { type: "string" },
  //     state: { type: "string" },
  //     postId: { type: "relationship", path: "posts", refpath: "name" },
  //     authorId: { type: "relationship", path: "users", refpath: "username" },
  //     createdAt: { type: "string" }
  //   },
  //   columns: ["_id", "state", "authorId"],
  //   order: 8
  // }, (err, post) => {
  //   console.log("Custom type inserted comments")
  // })

  // data.customTypes.insert({
  //   name: "settings",
  //   label: "Settings",
  //   icon: "fas fa-sliders-h",
  //   properties: {
  //     name: { type: "string", autokey: true, },
  //     value: { type: "string" },
  //   },
  //   columns: ["name", "value"],
  //   order: 15
  // }, (err, post) => {
  //   console.log("Custom type inserted settings")
  // })

}

exports.createDatas = () => {

  console.log("[INFO] installing defaut datas...")

  // Create default menu Posts
  data.menus.findOne({ name: "posts" }, (err, post) => {
    if (!post)
      data.menus.insert({
        title: "Posts",
        name: "posts",
        type: "posts",
        target: "/posts",
        order: 1
      }, (err, post) => {
        console.log("[INFO] default menu posts")
      })
  })

  // Create default menu Hello Word
  data.menus.findOne({ name: "hello-world" }, (err, post) => {
    if (!post)
      data.menus.insert({
        title: "Hello world",
        name: "hello-world",
        type: "posts",
        target: "/posts/hello-world",
        order: 2
      }, (err, post) => {
        console.log("[INFO] default menu created")
      })
  })

  // Create default menu Hello Word
  data.menus.findOne({ name: "my-category" }, (err, post) => {
    if (!post)
      data.menus.insert({
        title: "My category",
        name: "my-category",
        type: "categories",
        target: "/posts?categories=cat",
        order: 3
      }, (err, post) => {
        console.log("[INFO] default menu created")
      })
  })


  // Create default menu Google
  data.menus.findOne({ name: "google" }, (err, post) => {
    if (!post)
      data.menus.insert({
        title: "Google",
        name: "google",
        type: "direct",
        target: "http://www.google.fr",
        order: 5
      }, (err, post) => {
        console.log("[INFO] default menu created")
      })
  })

  // Create default menu About
  data.menus.findOne({ name: "about" }, (err, post) => {
    if (!post)
      data.menus.insert({
        title: "About",
        name: "about",
        type: "pages",
        target: "pages/about",
        order: 10
      }, (err, post) => {
        console.log("[INFO] default menu created")
      })
  })

  // Create default page Hello World
  data.posts.findOne({ name: "hello-world" }, (err, post) => {
    if (!post)
      data.posts.insert({
        title: "Hello World",
        name: "hello-world",
        content: 'Welcome to OP CMS. This is your first post. Edit or delete it, then start writing !',
        image: "banner.jpg",
        categories: "cat",
        tags: ["presentation", "website", "OP cms"],
        status: "publish",
        createdAt: new Date()
      }, (err, post) => {
        console.log("[INFO] default post Hello World created")
      })
  })

  // Create default page About
  data.pages.findOne({ name: "about" }, (err, post) => {
    if (!post)
      data.pages.insert({
        title: "About",
        name: "about",
        status: "publish",
        content: '<h2>Who we are</h2><p>Our website address is: http://opcms.com.</p>'
      }, (err, page) => {
        console.log("[INFO] default page About created")
      })
  })

  // Create default user Olivier
  data.users.findOne({ name: "Olivier" }, (err, user) => {
    if (!user)
      data.users.insert({
        name: "Olivier",
        role: "admin",
        email: "leperenoel38@hotmail.fr",
        password: "123"
      }, (err, user) => {
        console.log("[INFO] default user Olivier created")
      })
  })


}