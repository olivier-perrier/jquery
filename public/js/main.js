const URL = 'http://localhost:3000'

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
    $.post(URL + "/users/loggin", { name: logginName }, (data, statut) => {
        console.log(data)

        //Loggin is followed by getting informations from the server to display it
        updateFromServer()
    })
}

function signup(name) {
    $.post(URL + "/users/signup", { name: name }, (data, statut) => {
        console.log(data)
    })
}

function account() {
    $.get(URL + "/users/account", (data, statut) => {
        console.log(data)
    })
}


// Updating
function updateFromServer(callback) {
    $.get(URL + "/resources/update/", function (data, status) {
        console.log(data)
        resource = data
    }).then(updateLocal)

    $.get(URL + "/defences/update/", function (data, status) {
        console.log(data)
        defence = data
    }).then(updateLocal)
}

function DEBUG_CREATE() {
    $.post(URL + "/defences/create/", function (data, status) {
        console.log(data)
        defence = data
    }).then(updateLocal)
}

function updateLocal() {
    $("#resourceName").html(resource.name)
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

