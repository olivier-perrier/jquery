console.log("[INFO] Installation")

var db = require('../components/data.js')

var customTypesModel = {
  name: "customTypes",
  setting: `[{"name":"name"}, 
            {"name":"setting", "type":"Textarea", "hideTab":true},
            {"name":"icon", "hideTab":true},
            {"name":"order", "type":"Number"}]`,
  icon: "fab fa-suse",
  order: 999
}

var usersModel = {
  name: "users",
  setting: `[{"name":"firstname"},
            {"name":"lastname", "hideTab":true},
            {"name":"email"},
            {"name":"password", "type":"Password", "hideTab":true},
            {"name":"role", "type":"Select", "options":["admin", "reporter", "user"]}
            ]`,
  icon: "far fa-user",
  order: 5
}

var settingsModel = {
  name: "settings",
  setting: `[{"name":"name"}, {"name":"value"}]`,
  icon: "fas fa-sliders-h",
  order: 9
}

var postsModel = {
  name: "posts",
  setting: `[{"name":"title"},
            {"name":"authorId","type":"Relationship", "postType":"users", "postField":"firstname"},
            {"name":"state"},
            {"name":"image", "hideTab":true},
            {"name":"content", "type":"Textarea", "hideTab":true},
            {"name":"categories"},{"name":"tags"},{"name":"createdAt"},{"name":"updatedAt", "hideTab":true}]`,
  icon: "far fa-envelope-open",
  order: 1
}

var menusModel = {
  name: "menus",
  setting: `[{"name":"title"}, 
            {"name":"type", "type":"Select", "options":["direct", "posts", "post"]},
            {"name":"postType", "type":"Relationship", "postType":"customTypes", "postField":"name"},
            {"name":"link"},
            {"name":"order"}, 
            {"name":"parent", "type":"Relationship", "postType":"menus", "postField":"title"}]`,
  icon: "far fa-compass",
  order: 4
}

var models = [customTypesModel, menusModel, postsModel, usersModel, settingsModel]

function createModels() {

  models.forEach(model => {

    db.customTypes.findOne({ name: model.name }, (err, post) => {
      if (post) {
        // console.log("[INFO] model exist " + post.name)
      } else {
        db.customTypes.insert(model, (err, newPost) => {
          console.log("[INFO] model created " + newPost.name)
        })
      }
    })
  });

}

module.exports = { createModels }

// exports.createDatas = () => {

//   console.log("[INFO] installing defaut dbs...")

//   // Create default menu Posts
//   db.menus.findOne({ name: "posts" }, (err, post) => {
//     if (!post)
//       db.menus.insert({
//         title: "Posts",
//         name: "posts",
//         type: "posts",
//         target: "/posts",
//         order: 1
//       }, (err, post) => {
//         console.log("[INFO] default menu posts")
//       })
//   })

//   // Create default menu Hello Word
//   db.menus.findOne({ name: "hello-world" }, (err, post) => {
//     if (!post)
//       db.menus.insert({
//         title: "Hello world",
//         name: "hello-world",
//         type: "posts",
//         target: "/posts/hello-world",
//         order: 2
//       }, (err, post) => {
//         console.log("[INFO] default menu created")
//       })
//   })

//   // Create default menu Hello Word
//   db.menus.findOne({ name: "my-category" }, (err, post) => {
//     if (!post)
//       db.menus.insert({
//         title: "My category",
//         name: "my-category",
//         type: "categories",
//         target: "/posts?categories=cat",
//         order: 3
//       }, (err, post) => {
//         console.log("[INFO] default menu created")
//       })
//   })


//   // Create default menu Google
//   db.menus.findOne({ name: "google" }, (err, post) => {
//     if (!post)
//       db.menus.insert({
//         title: "Google",
//         name: "google",
//         type: "direct",
//         target: "http://www.google.fr",
//         order: 5
//       }, (err, post) => {
//         console.log("[INFO] default menu created")
//       })
//   })

//   // Create default menu About
//   db.menus.findOne({ name: "about" }, (err, post) => {
//     if (!post)
//       db.menus.insert({
//         title: "About",
//         name: "about",
//         type: "pages",
//         target: "pages/about",
//         order: 10
//       }, (err, post) => {
//         console.log("[INFO] default menu created")
//       })
//   })

//   // Create default page Hello World
//   db.posts.findOne({ name: "hello-world" }, (err, post) => {
//     if (!post)
//       db.posts.insert({
//         title: "Hello World",
//         name: "hello-world",
//         content: 'Welcome to OP CMS. This is your first post. Edit or delete it, then start writing !',
//         image: "banner.jpg",
//         categories: "cat",
//         tags: ["presentation", "website", "OP cms"],
//         status: "publish",
//         createdAt: new Date()
//       }, (err, post) => {
//         console.log("[INFO] default post Hello World created")
//       })
//   })

//   // Create default page About
//   db.pages.findOne({ name: "about" }, (err, post) => {
//     if (!post)
//       db.pages.insert({
//         title: "About",
//         name: "about",
//         status: "publish",
//         content: '<h2>Who we are</h2><p>Our website address is: http://opcms.com.</p>'
//       }, (err, page) => {
//         console.log("[INFO] default page About created")
//       })
//   })

//   // Create default user Olivier
//   db.users.findOne({ name: "Olivier" }, (err, user) => {
//     if (!user)
//       db.users.insert({
//         name: "Olivier",
//         role: "admin",
//         email: "leperenoel38@hotmail.fr",
//         password: "123"
//       }, (err, user) => {
//         console.log("[INFO] default user Olivier created")
//       })
//   })


// }