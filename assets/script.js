function getCity(city){
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=7e7ac2e4d0df13d3af84f0a0b1ffdd9b"
    $.ajax({
        url : queryURL,
        method : 'GET' ,
    }).then(function(response){
        console.log(response)
    })   
}
getCity('seoul');