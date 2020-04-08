
const axios = require('axios');

var data = require("../models/data");


function loadRequests() {
    console.log("loading requests")
    console.log(data)
    data.requests.find({}, (err, posts) => {

        posts.forEach(post => {
            // get the trigger

            // Build the trigger
            setInterval(function() { console.log("call")}, 5000)

            // Run the request
            axios.get(post.url).then(response => {
                console.log(response.data.url)
            })

        });
    })
}

// this.loadRequests()

// axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
//     .then(response => {
//         console.log(response.data);
//         console.log(response.data.url);
//         console.log(response.data.explanation);
//     })
//     .catch(error => {
//         console.log(error);
//     });


module.exports = {loadRequests : loadRequests};
