// Created Variables that will hold all necessary information
var apiKey = '2b1c96462809307f138f6c030549d7a1';
var city = '';
var date = moment().format('dddd, MMMM Do YYYY');
var currentTime = moment().format('YYYY-MM-DD HH:MM:SS');
var searchHistory = $('.searchHistory');
var currentDay = $('.currentDay'); 
var fiveDayForecastEl = $('.fiveDayForecast');
var cityInp = [];
// Created a function that will run when the search button is clicked and given a valid input
$('.search').on('click', function (event) {
    event.preventDefault();
    city = $(this).parent('.btnPar').siblings('.textVal').val().trim();
    if (city === '') {
        alert("Enter a city name")
        return;
    };
    cityInp.push(city);
    localStorage.setItem('city', JSON.stringify(cityInp));
    fiveDayForecastEl.empty();
    getHistory();
    todaysWeather();
});
// Function that will add the entered input to the search history
function getHistory() {
    searchHistory.empty();
    for (var i = 0; i < cityInp.length; i++) {
        
        var rowEl = $('<row>');
        var btnEl = $('<button>').text(`${cityInp[i]}`);

        rowEl.addClass('row histBtnRow');
        btnEl.addClass('btn btn-outline-secondary histBtn');
        btnEl.attr('type', 'button');

        searchHistory.prepend(rowEl);
        rowEl.append(btnEl);
    } if (!city) {
        return;
    }
   
    $('.histBtn').on('click', function (event) {
        event.preventDefault();
        city = $(this).text();
        fiveDayForecastEl.empty();
        todaysWeather();
});
};
//Function that will display the current weather for the city that was entered
function todaysWeather() { 
    var urlToday = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    $(currentDay).empty();
//ajax call that uses the urlToday variable to make an api call to get the current weather and will assign the necessary information to the corresponding html elements
    $.ajax({
        url: urlToday,
        method: 'GET',
    }).then(function (response) {
        $('.currentCityName').text(response.name);
        $('.currentDate').text(date);
        $('.icons').attr('src', 'http://openweathermap.org/img/w/' + response.weather[0].icon + '.png');
  
        var paragraphEl = $('<p>').text('Temperature: ' + response.main.temp + '°F');
        $(currentDay).append(paragraphEl);
    
        var paragraphElHumidity = $('<p>').text('Humidity: ' + response.main.humidity + '%');
        $(currentDay).append(paragraphElHumidity);
       
        var paragraphElWind = $('<p>').text('Wind Speed: ' + response.wind.speed + ' MPH');
        $(currentDay).append(paragraphElWind);
}); 
//Function that will display the 5 day forecast for the city that was entered after the current weather is displayed
    forecast();
};
//Function that gets the 5 day forecast for the current city that information is then entered into an object and then pushed into an array
function forecast () {
    var fiveDayForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

    $.ajax({ 
        url: fiveDayForecastUrl,
        method: 'GET',
}).then(function (response) {
    var fiveDayArr = response.list;
    var myWeather = [];
    $.each(fiveDayArr, function (index, value) {
        weatherObj = {
            date: value.dt_txt.split(' ')[0],
            time: value.dt_txt.split(' ')[1],
            temp: value.main.temp,
            wind: value.wind.speed,
            icon: value.weather[0].icon,
            humidity: value.main.humidity,
        }

        if (value.dt_txt.split(' ')[1] === '12:00:00') {
            myWeather.push(weatherObj);
        }
    });
   //For loop that will create the cards for the 5 day forecast and will assign the necessary information to the corresponding html elements
    for (let i = 0; i < myWeather.length; i++) {

        var cardEl = $('<div>');
        cardEl.attr('class', 'card text-white bg-dark mb-3 cardOne');
        cardEl.attr('style', 'max-width: 18rem;');
        fiveDayForecastEl.append(cardEl);

        var cardElHeader = $('<div>');
        cardElHeader.attr('class', 'card-header');
        var m = moment(`${myWeather[i].date}`).format('MM-DD-YYYY');
        cardElHeader.text(m);
        cardEl.append(cardElHeader);

        var cardElBody = $('<div>');
        cardElBody.attr('class', 'card-body');
        cardEl.append(cardElBody);

        var iconEl = $('<img>');
        iconEl.attr('class', 'icons');
        iconEl.attr('src', 'http://openweathermap.org/img/w/' + myWeather[i].icon + '.png');
        cardElBody.append(iconEl);
        var temperatureParagraphEl = $('<p>').text(`Temperature: ${myWeather[i].temp}°F`);
        cardElBody.append(temperatureParagraphEl);
        var humidityEl = $('<p>').text(`Humidity: ${myWeather[i].humidity}%`);
        cardElBody.append(humidityEl);
        var windSpeedEl = $('<p>').text(`Wind Speed: ${myWeather[i].wind} MPH`);
        cardElBody.append(windSpeedEl);
    }
});
};

