
const axios = require('axios');

var data = require("../models/data");


function loadRequests() {
    console.log("[REQUESTS] Loading requests")
    
    data.requests.find({}, (err, posts) => {

        posts.forEach(post => {

            // get the trigger
            var triggerTime = post.triggerTime

            // Build the trigger
            setInterval(function () {
                console.log("[DEBUG] Request (" + post.name + ") calling " + post.url)

                // Run the request
                axios.get(post.url).then(response => {

                    new Function("response", post.function)(response)

                })

            }, triggerTime || 5000)


        });
    })
}

module.exports = { loadRequests: loadRequests };
