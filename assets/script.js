$(document).ready(function(){
    var cityArray=[];
    // get city weather information from API
    function getCity(city){
        var queryURL = "http://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=7e7ac2e4d0df13d3af84f0a0b1ffdd9b"
        $.ajax({
            url : queryURL,
            method : 'GET' ,
        }).then(function(response){
            console.log(response);
            // display information from API
            $('#cityName').text(response.name);
            $('.lead').append('')
            response.name;
            response.main.humidity;
            response.wind.speed;
        })   
    }
    // get input data from local storage 
    function init(){
        var show = JSON.parse(localStorage.getItem('city'));
        cityArray = show;
        console.log(cityArray);
    }
    // store input data to local storage
    $('button').on('click', function(){
        var userInput = $('input').val();
        getCity(userInput);
        cityArray.push(userInput);
        localStorage.setItem('city', JSON.stringify(cityArray));
    })
    init();
})
