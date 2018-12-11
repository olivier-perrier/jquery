// const URL = 'http://localhost:3000'
const URL = ""

$(() => {

      $("#logginForm").submit((event) => {
        event.preventDefault()
        loggin($("#logginInput").val())
    })

    $("#signup").click(() => {
        signup($("#logginInput").val())
    })
    
    $("#account").click(() => {
        account()
    })
    

    // Resources
    $("#upgrade").click(() => {
        upgrade()
    })

    // Defences
    $("#buildDefence").click(() => {
        buildDefence($("#defenceBuildNumber").val())
    })

    // DEBUG
    $("#update").click(() => {
        updateFromServer()
    })

    $("#DEBUG_CREATE").click(() => {
        DEBUG_CREATE()
    })

});

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

// Resources

function upgrade(){
    $.post(URL + "/resources/upgrade", (data) => {
        console.log(data)
        updateFromServer()
    })
    resource.level++
    updateLocal()
}

// Defences

function buildDefence(number){
    console.log("buildDefence " + number)
    $.post(URL + "/defences/build", {numberToBuild: number}, (data) => {
        console.log(data)
    })
    // resource.level++
    // updateLocal()
}


// Updating
function updateFromServer() {
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
    resource.quantity += (resource.production * resource.level)
    $(".resource .quantity").html(Math.round(resource.quantity))
}, 1000)
