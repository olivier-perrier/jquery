// Test 

var db = new Nedb("users.nedb");   // Create an in-memory only datastore

db.insert({ planet: 'Earth' }, function (err) {
    db.find({}, function (err, docs) {
        console.log('Test Browser db')
        console.log(docs)
    });
});

$(document).ready(function () {

    loggin("Olivier")

    $("#upgrade").click(() => {
        $.post("http://localhost:3000/resources/upgrade", (data) => {
            console.log(data)
        })
        resource.level++
        updateLocal()
    })

    $(".update").click(() => {
        updateFromServer()
    })

    $("#logginForm").submit((event) => {
        event.preventDefault()
        loggin($("#logginInput").val())
    })

    $("#loggin").click(() => {
        loggin($("#logginInput").val())
    })

    $("#account").click(() => {
        account()
    })

    $("#signup").click(() => {
        signup($("#logginInput").val())
    })

    // DEBUG
    $("#DEBUG_CREATE").click(() => {
        DEBUG_CREATE()
    })

});

// Users
function loggin(logginName) {
    $.post("http://localhost:3000/users/loggin", { name: logginName }, (data, statut) => {
        console.log(data)

        //Loggin is followed by getting informations from the server to display it
        updateFromServer()
    })
}

function signup(name) {
    $.post("http://localhost:3000/users/signup", { name: name }, (data, statut) => {
        console.log(data)
    })
}

function account() {
    $.get("http://localhost:3000/users/account", (data, statut) => {
        console.log(data)
    })
}


// Updating
function updateFromServer(callback) {
    $.get("http://localhost:3000/resources/update/", function (data, status) {
        console.log(data)
        resource = data
    }).then(updateLocal)

    $.get("http://localhost:3000/defences/update/", function (data, status) {
        console.log(data)
        defence = data
    }).then(updateLocal)
}

function DEBUG_CREATE() {
    $.post("http://localhost:3000/defences/create/", function (data, status) {
        console.log(data)
        defence = data
    }).then(updateLocal)
}

function updateLocal() {
    $(".resource .resourceName").html(resource.name)
    $(".resource .resourceLevel").html(resource.level)
    $(".resource .quantity").html(Math.round(resource.quantity))
    $(".resource .production").html(Math.round(resource.production))

    $("#defenceName").html(defence.name)
    $("#defenceNumber").html(defence.number)
    $("#defenceAttack").html(defence.attack)
    $("#defenceDef").html(defence.defence)

}

var resource = {}
var defence = {}

setInterval(() => {
    resource.quantity += resource.production
    $(".resource .quantity").html(Math.round(resource.quantity))
}, 1000)

