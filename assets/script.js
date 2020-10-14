$(document).ready(function () {
  var cityArray = [];
  // get city weather information from API
  function getCity(city) {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=7e7ac2e4d0df13d3af84f0a0b1ffdd9b&units=imperial";
    $.ajax({
      url: queryURL,
      method: "GET",
    })
      .fail(function (fail) {})
      .then(function (response) {
        if (cityArray.indexOf(city) == -1) {
          cityArray.push(city);
          localStorage.setItem("city", JSON.stringify(cityArray));
        }
        $(".search-log").empty();
        init();
        $("input").val("");

        var icon = response.weather[0].icon;
        var timeStamp = new Date(response.dt * 1000);
        var year = timeStamp.getFullYear();
        var month = timeStamp.getMonth() + 1;
        var date = timeStamp.getDate();
        // display information from API
        $("#cityName").text(
          response.name + " (" + month + "/" + date + "/" + year + ")"
        );
        $("#cityName").append(
          "<img src='https://openweathermap.org/img/wn/" + icon + "@2x.png'/>"
        );
        $(".temp").text(response.main.temp + "℉");
        $(".humidity").text(response.main.humidity + "%");
        $(".speed").text(response.wind.speed + "MPH");
        // call UV information
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        $.ajax({
          url:
            "https://api.openweathermap.org/data/2.5/uvi?lat=" +
            lat +
            "&lon=" +
            lon +
            "&appid=7e7ac2e4d0df13d3af84f0a0b1ffdd9b",
          method: "GET",
        }).then(function (uvCall) {
          $(".uvIndex").text(uvCall.value);
          if (uvCall.value <= 2) {
            $(".uvIndex").attr(
              "style",
              "background-color:rgb(79, 180, 0); border-radius:0.3rem"
            );
          } else if (uvCall.value > 2 && uvCall.value <= 5) {
            $(".uvIndex").attr(
              "style",
              "background-color:rgb(248, 182, 0); border-radius:0.3rem"
            );
          } else if (uvCall.value > 5 && uvCall.value <= 7) {
            $(".uvIndex").attr(
              "style",
              "background-color:rgb(248, 89, 0); border-radius:0.3rem"
            );
          } else if (uvCall.value > 7 && uvCall.value <= 10) {
            $(".uvIndex").attr(
              "style",
              "background-color:rgb(216, 31, 29); border-radius:0.3rem"
            );
          } else {
            $(".uvIndex").attr(
              "style",
              "background-color:rgb(153, 140, 255); border-radius:0.3rem"
            );
          }
        });
        // 5days weather info call
        $.ajax({
          url:
            "https://api.openweathermap.org/data/2.5/forecast?lat=" +
            lat +
            "&lon=" +
            lon +
            "&exclude=hourly,minutely,current&appid=7e7ac2e4d0df13d3af84f0a0b1ffdd9b&units=imperial",
          method: "GET",
        }).then(function (dayWeather) {
          var i = 4;
          // call only 5 days of weather info
          while (i < 37) {
            var daysTimeStamp = dayWeather.list[i].dt_txt;
            var days = daysTimeStamp.slice(0, 10).split("-");
            var daysDate = days[1] + "/" + days[2] + "/" + days[0];
            var daysIcon = dayWeather.list[i].weather[0].icon;
            var daysTemp = dayWeather.list[i].main.temp;
            var daysHumidity = dayWeather.list[i].main.humidity;
            var newElementWrap = $(
              '<div class="card text-white bg-primary d-inline-block" style="max-width:13rem"></div>'
            );
            var newElementBody = $('<div class="card-body float-right mr-0">');
            var newElementDate = $('<h5 class="card-title"></h5>');
            var newElementIcon = $("<img>");
            var newElementInfo = $('<p class="card-text"></p>');
            var newElementTemp = $('<p class="temp-days"></p>');
            var newElementHumidity = $('<p class="humidity-days"></p>');
            newElementDate.text(daysDate);
            newElementIcon.attr(
              "src",
              "https://openweathermap.org/img/wn/" + daysIcon + ".png"
            );
            newElementTemp.text("Temp: " + daysTemp + "℉");
            newElementHumidity.text("Humidity: " + daysHumidity + "%");
            newElementInfo.append(newElementTemp);
            newElementInfo.append(newElementHumidity);
            newElementBody.append(newElementDate);
            newElementBody.append(newElementIcon);
            newElementBody.append(newElementInfo);
            newElementWrap.append(newElementBody);
            $(".5-day-forecast").append(newElementWrap);
            i = i + 8;
          }
        });
      });
  }
  // get input data from local storage
  function init() {
    // get focus on the input search box
    $(".form-control").focus();
    var show = JSON.parse(localStorage.getItem("city"));
    if (show !== null) {
      cityArray = show;
      createArrayList();
    }
  }
  function createArrayList() {
    for (var i = 0; i < cityArray.length; i++) {
      var newElementArray = $(
        "<li class='list-group-item list-group-item-light' id='list'></li>"
      );
      var clearButton = $(
        '<i id="clearBtn" class="fa fa-trash fa-2x" aria-hidden="true"></i>'
      );
      newElementArray.text(cityArray[i]);
      newElementArray.attr("data-index", cityArray[i]);
      clearButton.attr("data-index", cityArray[i]);
      newElementArray.append(clearButton);
      $(".search-log").append(newElementArray);
    }
  }
  // if click list area, display weather info of clicked city
  $(".search-log").on("click", "li", function () {
    $(".5-day-forecast").empty();
    var cityClicked = $(this).data().index;
    getCity(cityClicked);
    console.log("clicked");
  });
  // if click clear btn, delete that userInput from array
  $(".search-log").on("click", "#clearBtn", function (event) {
    event.stopPropagation();
    var clearString = $(this).data().index;
    var clearIndex = cityArray.indexOf(clearString);
    cityArray.splice(clearIndex, 1);
    localStorage.setItem("city", JSON.stringify(cityArray));
    JSON.parse(localStorage.getItem("city"));
    $(".search-log").empty();
    createArrayList();
  });
  // store input data to local storage
  $("#button-addon2").on("click", function (event) {
    event.preventDefault();
    $(".5-day-forecast").empty();
    var userInput = $("input").val();
    getCity(userInput);
  });
  $(".form-control").on("keypress", function (e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      $(".5-day-forecast").empty();
      var userInput = $("input").val();
      getCity(userInput);
    }
  });
  init();
});
