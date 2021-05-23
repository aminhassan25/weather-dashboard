// Variable for a searched city
let city = "";
// Variables
let searchCity = $("#search-city");
let searchButton = $("#search-button");
let clearButton = $("#clear-history");
let currentCity = $("#current-city");
let currentTemperature = $("#temperature");
let currentHumidty = $("#humidity");
let currentWSpeed = $("#wind-speed");
let currentUvindex = $("#uv-index");
let sCity = [];
// Searches to see if the city exists
function find(c) {
    for (let i = 0; i < sCity.length; i++) {
        if (c.toUpperCase() === sCity[i]) {
            return -1;
        }
    }
    return 1;
}
// API key
let APIKey = "a0aca8a89948154a4182dcecc780b513";
// Show the curent and future weather 
function displayWeather(event) {
    event.preventDefault();
    if (searchCity.val().trim() !== "") {
        city = searchCity.val().trim();
        currentWeather(city);
    }
}
// Here we create the AJAX call
function currentWeather(city) {
    // The URL so we can get a data from server side.
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function(response) {


        console.log(response);
        let weathericon = response.weather[0].icon;
        let iconurl = "https://openweathermap.org/img/wn/" + weathericon + "@2x.png";

        let date = new Date(response.dt * 1000).toLocaleDateString();
        // Search for name of city and concanatig the date and icon.
        $(currentCity).html(response.name + "(" + date + ")" + "<img src=" + iconurl + ">");

        // Convert the temp to fahrenheit

        let tempF = (response.main.temp - 273.15) * 1.80 + 32;
        $(currentTemperature).html((tempF).toFixed(2) + "&#8457");
        // Show the Humidity
        $(currentHumidty).html(response.main.humidity + "%");
        // Show Wind speed and convert to MPH
        let ws = response.wind.speed;
        var windsmph = (ws * 2.237).toFixed(1);
        $(currentWSpeed).html(windsmph + "MPH");
        // Show UVIndex.

        UVIndex(response.coord.lon, response.coord.lat);
        forecast(response.id);
        if (response.cod == 200) {
            sCity = JSON.parse(localStorage.getItem("cityname"));
            console.log(sCity);
            if (sCity == null) {
                sCity = [];
                sCity.push(city.toUpperCase());
                localStorage.setItem("cityname", JSON.stringify(sCity));
                addToList(city);
            } else {
                if (find(city) > 0) {
                    sCity.push(city.toUpperCase());
                    localStorage.setItem("cityname", JSON.stringify(sCity));
                    addToList(city);
                }
            }
        }

    });
}
// Return the UVIindex response.
function UVIndex(ln, lt) {
    // The url for uvindex.
    let uvqURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lt + "&lon=" + ln;
    $.ajax({
        url: uvqURL,
        method: "GET"
    }).then(function(response) {
        $(currentUvindex).html(response.value);
    });
}

// 5 days forecast for the current city.
function forecast(cityid) {
    let dayover = false;
    let queryforcastURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityid + "&appid=" + APIKey;
    $.ajax({
        url: queryforcastURL,
        method: "GET"
    }).then(function(response) {

        for (i = 0; i < 5; i++) {
            let date = new Date((response.list[((i + 1) * 8) - 1].dt) * 1000).toLocaleDateString();
            let iconcode = response.list[((i + 1) * 8) - 1].weather[0].icon;
            let iconurl = "https://openweathermap.org/img/wn/" + iconcode + ".png";
            let tempK = response.list[((i + 1) * 8) - 1].main.temp;
            let tempF = (((tempK - 273.5) * 1.80) + 32).toFixed(2);
            let humidity = response.list[((i + 1) * 8) - 1].main.humidity;

            $("#fDate" + i).html(date);
            $("#fImg" + i).html("<img src=" + iconurl + ">");
            $("#fTemp" + i).html(tempF + "&#8457");
            $("#fHumidity" + i).html(humidity + "%");
        }

    });
}

// Add the city to the search history
function addToList(c) {
    let listEl = $("<li>" + c.toUpperCase() + "</li>");
    $(listEl).attr("class", "list-group-item");
    $(listEl).attr("data-value", c.toUpperCase());
    $(".list-group").append(listEl);
}


// Render function
function loadlastCity() {
    $("ul").empty();
    let sCity = JSON.parse(localStorage.getItem("cityname"));
    if (sCity !== null) {
        sCity = JSON.parse(localStorage.getItem("cityname"));
        for (i = 0; i < sCity.length; i++) {
            addToList(sCity[i]);
        }
        city = sCity[i - 1];
        currentWeather(city);
    }

}
// Clear search history from the page
function clearHistory(event) {
    event.preventDefault();
    sCity = [];
    localStorage.removeItem("cityname");
    document.location.reload();

}
// Buttons
$("#search-button").on("click", displayWeather);
$(document).on("click", invokePastSearch);
$(window).on("load", loadlastCity);
$("#clear-history").on("click", clearHistory);