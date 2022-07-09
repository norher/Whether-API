const cityEl = document.getElementById('cityInput');
const currentCityEl = document.getElementById('cityName');
const searchDiv = document.getElementById('searchArea');
const searchHistory = document.getElementById('searchHistory');
const tempEl = document.getElementById('temp');
const imageEl = document.getElementById('image');
const windEl = document.getElementById('wind');
const humidityEl = document.getElementById('humidity');
const uvEl = document.getElementById('uv');
const cardHolderEl = document.getElementById('cardHolder');
const apiKey = 'ebfa1cc409bdad3120631b857ca0e364';
var cityList = [];
const todayDate = moment().format("dddd, MMM Do YYYY");

//Initializes application
init();

// Checks localStorage, makes buttons for cities in localStorage
function init() {
    var storedCities = localStorage.getItem('history');
    if (storedCities) {
        var cityList = JSON.parse(storedCities);
        for (var i = 0; i < cityList.length; i++) {
            var newBtn = document.createElement('button');
            newBtn.setAttribute('class', 'btn btn-outline-dark newBtn');
            newBtn.setAttribute('value', cityList[i]);
            newBtn.textContent = cityList[i];
            searchHistory.appendChild(newBtn);
        }
        return cityList;
    };
};
        
// Passes city to apicall to get lat and lon, saves them in localStorage
function getCoordinates() {
    var coordinateRoot = 'http://api.openweathermap.org/geo/1.0/direct?q='
    var city = localStorage.getItem('city');
    fetch(coordinateRoot + city + '&appid=' + apiKey)
        .then(function (response) {
            return response.json();
        })
        .then(function(data) {
            localStorage.setItem('lat', data[0].lat);
            localStorage.setItem('lon', data[0].lon);
            getWeather();
        });
    };
    

// retrives localStorage for lat and lon and passes it the API key. populates current weather element, 
//Makes cards for the forecast and populates it to the DOM
function getWeather() {
    const lat = localStorage.getItem('lat');
    const lon = localStorage.getItem('lon');
    const weatherRoot = 'https://api.openweathermap.org/data/3.0/onecall?lat=';
    fetch(weatherRoot + lat + '&lon=' + lon + '&units=imperial&exclude=hourly,minutely&appid=' + apiKey)
        .then(function (response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            currentCityEl.innerText = "Here is today's forecast for: " + localStorage.getItem('city').toUpperCase() + " on this beautiful " + todayDate;
            var todaysCode = data.current.weather[0].icon;
            console.log(todaysCode);
            imageEl.setAttribute('src', "http://openweathermap.org/img/wn/" + todaysCode + "@2x.png");
            tempEl.innerText = `Currently it's ${data.current.temp} °F outside`;
            windEl.innerText = `Wind is ${data.current.wind_speed} MPH`;
            humidityEl.innerText = `Humidity is ${data.current.humidity}%`;
            uvEl.innerText = `UV Index is: ${data.current.uvi}`;
            if (data.current.uvi <= 2) {
                uvEl.setAttribute('class', 'favorable')
            } else if (data.current.uvi > 2 && data.current.uvi <= 5) {
                uvEl.setAttribute('class', 'moderate')
            } else if (data.current.uvi > 6) {
                uvEl.setAttribute('class', 'severe')
            }
            $('#cardHolder').empty();
            for (var i = 1; i < 6; i++) {
                var card = document.createElement('div');
                card.setAttribute('class', 'card mb-3 col-md-2');
                var date = moment().add(i, 'd').format('dddd, MMM Do');
                var cardTitle = document.createElement('div');
                cardTitle.textContent = date;
                cardTitle.setAttribute('class', 'card-header');
                var icon = document.createElement('img');
                var iconCode = data.daily[i].weather[0].icon;
                var iconImage = `http://openweathermap.org/img/wn/${iconCode}@2x.png`
                icon.setAttribute('src', iconImage);
                var contents = document.createElement('ul');
                contents.setAttribute('class', 'card-text list-unstyled');
                var templi = document.createElement('li');
                templi.textContent = `Temp: ${data.daily[i].temp.day} °F`;
                var windli = document.createElement('li');
                windli.textContent = `Wind: ${data.daily[i].wind_speed} MPH`;
                var humidityli = document.createElement('li');
                humidityli.textContent = `Humidity: ${data.daily[i].humidity}%`;
                $('li').addClass('list-group-item');
                contents.append(templi, windli, humidityli);
                card.append(cardTitle, icon, contents);
                cardHolderEl.appendChild(card);
            };
        });
    };

// Searches for the city passed in our input element and adds a button to history
$('#searchBtn').click( function(event) {
    event.preventDefault();
    var searchedCity = cityEl.value;
    var pastCity = searchedCity.trim();
    localStorage.setItem('city', searchedCity);
    storeCity(pastCity);
    getCoordinates();
    $('#cityInput').empty();
    var newBtn = document.createElement('button');
    newBtn.textContent = searchedCity;
    newBtn.setAttribute('class', 'btn btn-outline-dark newBtn');
    newBtn.setAttribute('id', 'generatedBtn');
    newBtn.setAttribute('value', searchedCity);
    searchHistory.appendChild(newBtn);
});

$('.newBtn').click( function() {
console.log(this.value);
})

//Stringifies city in localStorage
function storeCity(pastCity) {
    cityList.splice(0, 0, pastCity);
    localStorage.setItem('history', JSON.stringify(cityList));
};