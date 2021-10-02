moment().format('L');


function searchCity(cityname) {
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&units=imperial&appid=ecc0be5fd92206da3aa90cc41c13ca56";
    let queryURLforcast = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityname + "&units=imperial&appid=ecc0be5fd92206da3aa90cc41c13ca56";

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(response) {
        console.log(response);
        console.log(queryURL);
        $("#current").empty();
        var mainDate = moment().format('L');



        let cityNameEl = $("<h2>").text(response.name);
        let displayMainDate = cityNameEl.append(" " + mainDate);
        let tempEL = $("<p>").text("Tempraturer: " + response.main.temp);
        let humEl = $("<p>").text("Humidity: " + response.main.humidity);
        let windEl = $("<p>").text("Wind Speed: " + response.wind.speed);
        let currentweather = response.weather[0].main;

        if (currentweather === "Rain") {
            let currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/09d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        } else if (currentweather === "Clouds") {
            let currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/03d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        } else if (currentweather === "Clear") {
            let currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/01d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        } else if (currentweather === "Drizzle") {
            let currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/10d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        } else if (currentweather === "Snow") {
            let currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/13d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        }

        let newDiv = $('<div>');

        newDiv.append(displayMainDate, currentIcon, tempEL, humEl, windEl);

        $("#current").html(newDiv);



        let lat = response.coord.lat;
        let lon = response.coord.lon;
        let queryURLUV = "https://api.openweathermap.org/data/2.5/uvi?&appid=ecc0be5fd92206da3aa90cc41c13ca56&lat=" + lat + "&lon=" + lon;

        $.ajax({
            url: queryURLUV,
            method: 'GET'
        }).then(function(response) {
            $('#uvl-display').empty();
            let uvlresults = response.value;
            let uvlEl = $("<button class='btn bg-success'>").text("UV Index: " + response.value);

            $('#uvl-display').html(uvlEl);

        });
    });


    $.ajax({
        url: queryURLforcast,
        method: 'GET'
    }).then(function(response) {
        let results = response.list;

        $("#5day").empty();

        for (var i = 0; i < results.length; i += 8) {

            let fiveDayDiv = $("<div class='card shadow-lg text-white bg-primary mx-auto mb-10 p-2' style='width: 8.5rem; height: 11rem;'>");


            let date = results[i].dt_txt;
            let setD = date.substr(0, 10)
            let temp = results[i].main.temp;
            let hum = results[i].main.humidity;

            let h5date = $("<h5 class='card-title'>").text(setD);
            let pTemp = $("<p class='card-text'>").text("Temp: " + temp);;
            let pHum = $("<p class='card-text'>").text("Humidity " + hum);;

            let weather = results[i].weather[0].main

            if (weather === "Rain") {
                let icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/09d.png");
                icon.attr("style", "height: 40px; width: 40px");
            } else if (weather === "Clouds") {
                let icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/03d.png");
                icon.attr("style", "height: 40px; width: 40px");
            } else if (weather === "Clear") {
                let icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/01d.png");
                icon.attr("style", "height: 40px; width: 40px");
            } else if (weather === "Drizzle") {
                let icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/10d.png");
                icon.attr("style", "height: 40px; width: 40px");
            } else if (weather === "Snow") {
                let icon = $('<img>').attr("src", "http://openweathermap.org/img/wn/13d.png");
                icon.attr("style", "height: 40px; width: 40px");
            }

            fiveDayDiv.append(h5date);
            fiveDayDiv.append(icon);
            fiveDayDiv.append(pTemp);
            fiveDayDiv.append(pHum);
            $("#5day").append(fiveDayDiv);
        }

    });



}
pageLoad();


$("#select-city").on("click", function(event) {

    event.preventDefault();
    let cityInput = $("#city-input").val().trim();


    let textContent = $(this).siblings("input").val();
    let storearr = [];
    storearr.push(textContent);
    localStorage.setItem('cityName', JSON.stringify(storearr));

    searchCity(cityInput);
    pageLoad();
});


function pageLoad() {
    let lastSearch = JSON.parse(localStorage.getItem("cityName"));
    let searchDiv = $("<button class='btn border text-muted mt-1 shadow-sm bg-white rounded' style='width: 12rem;'>").text(lastSearch);
    let psearch = $("<div>");
    psearch.append(searchDiv)
    $("#searchhistory").prepend(psearch);
}

$("#searchhistory").on('click', '.btn', function(event) {
    event.preventDefault();
    console.log($(this).text());
    searchCity($(this).text());

});