// const URL = 'http://localhost:3000'
const URL = ""

$(() => {

    $("#logginForm").submit((event) => {
        event.preventDefault()
        login($("#logginInput").val())
    })

});
