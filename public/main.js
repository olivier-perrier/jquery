$(document).ready(function () {

    loggin("Olivier")

    $(".resource .upgrade").click(() => {
        $.post("http://localhost:3000/resource/upgrade", (data) => {
            console.log(data)
        })
        resource.level++
        updateLocal()
    })

    $(".update").click(() => {
        updateFromServer()
    })

    $("header input.loggin").click(() => {
        loggin($("header input.logginName").val())
    })

    $("header input.account").click(() => {
        account()
    })

    $("header input.signup").click(() => {
        signup($("header input.logginName").val())
    })


});

function loggin(logginName) {
    $.post("http://localhost:3000/user/loggin", { name: logginName }, (data, statut) => {
        console.log(data)

        //Loggin is followed by getting informations from the server to display it
        updateFromServer()
    })
}

function signup(name) {
    $.post("http://localhost:3000/user/signup", { name: name }, (data, statut) => {
        console.log("signup ")
        console.log(data)
    })
}

function account() {
    $.get("http://localhost:3000/user/account", (data, statut) => {
        console.log("Account informations ")
        console.log(data)
    })
}


// Updating
function updateFromServer(callback) {
    $.get("http://localhost:3000/resource/update/", function (data, status) {
        console.log(data)
        resource = data

        //Server update is always followed by a local update
        updateLocal()
    });
}

function updateLocal() {
    $(".resource .resourceName").html(resource.name)
    $(".resource .resourceLevel").html(resource.level)
    $(".resource .quantity").html(Math.round(resource.quantity))
    $(".resource .production").html(resource.production)
}

var resource = {}

setInterval(() => {
    resource.quantity = resource.quantity + resource.production * resource.level
    $(".resource .quantity").html(Math.round(resource.quantity))
}, 1000)

