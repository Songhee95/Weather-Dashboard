$(document).ready(function(){
    var cityArray=[];
    // get city weather information from API
    function getCity(city){
        var queryURL = "http://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=7e7ac2e4d0df13d3af84f0a0b1ffdd9b&units=imperial";
        $.ajax({
            url : queryURL,
            method : 'GET' ,
        }).then(function(response){
            var icon =response.weather[0].icon;
            var timeStamp = new Date(response.dt*1000);
            var year = timeStamp.getFullYear();
            var month = timeStamp.getMonth()+1;
            var date = timeStamp.getDate();
            // display information from API
            $('#cityName').text(response.name +" ("+month+'/'+date+"/"+year+")");
            $('#cityName').append("<img src='http://openweathermap.org/img/wn/"+icon+".png'/>");
            $('.temp').text(response.main.temp);
            $('.humidity').text(response.main.humidity);
            $('.speed').text(response.wind.speed);
            // call UV information
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            $.ajax({
                url:"http://api.openweathermap.org/data/2.5/uvi?lat="+lat+'&lon='+lon+"&appid=7e7ac2e4d0df13d3af84f0a0b1ffdd9b",
                method: 'GET'
            }).then(function(uvCall){
                $('.uvIndex').text(uvCall.value);
                if(uvCall.value<=2){
                    $('.uvIndex').attr('style','background-color:rgb(79, 180, 0); border-radius:0.3rem');
                }else if(uvCall.value>2 && uvCall.value<=5){
                    $('.uvIndex').attr('style', 'background-color:rgb(248, 182, 0); border-radius:0.3rem');
                }else if(uvCall.value>5 && uvCall.value<=7){
                    $('.uvIndex').attr('style', 'background-color:rgb(248, 89, 0); border-radius:0.3rem');
                }else if(uvCall.value>7 && uvCall.value<=10){
                    $('.uvIndex').attr('style', 'background-color:rgb(216, 31, 29); border-radius:0.3rem');
                }else{
                    $('.uvIndex').attr('style', 'background-color:rgb(153, 140, 255); border-radius:0.3rem');
                }
            })
            // 5days weather info call
            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&exclude=hourly,minutely,current&appid=7e7ac2e4d0df13d3af84f0a0b1ffdd9b",
                method: 'GET'
            }).then(function(dayWeather){
                console.log(dayWeather);
                var i=4;
                while(i<37){
                    console.log(dayWeather.list[i])
                    i=i+8;
                }
            })  
        }) 
    }
    // get input data from local storage 
    function init(){
        var show = JSON.parse(localStorage.getItem('city'));
        if(show !== null){
            cityArray = show;
        }
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
