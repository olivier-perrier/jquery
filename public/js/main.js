// const URL = 'http://localhost:3000'
const URL = ""

$(() => {

    // login("Olivier", "123")

    function login(username, password) {
        $.post(URL + "/users/loggin", { name: username, password: password }, (data, statut) => {
            console.log(data)
        })
    }

    $("#logginForm").submit((event) => {
        event.preventDefault()
        login($("#logginInput").val())
    })

});
