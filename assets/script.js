const cityEl = document.getElementById('cityInput');
const currentWeatherEl = document.getElementById('currentWeather');
const currentCityEl = document.getElementById('cityName');
const tempEl = document.getElementById('temp');
const windEl = document.getElementById('wind');
const humidityEl = document.getElementById('humidity');
const uvEl = document.getElementById('uv');

const apiKey = 'ebfa1cc409bdad3120631b857ca0e364';

// $('#SearchBtn').click( function(event) {
    //     event.preventDefault();
    //     city = cityEl.value
    //     onsole.log(city);
    // });
    
    // function pullWeather(event) {
        //     event.preventDefault();
        //     var city = cityInputEl.value.trim();
        //     localStorage.setItem('city', city);
        // };
        
function getCoordinates() {
    var coordinateRoot = 'http://api.openweathermap.org/geo/1.0/direct?q='
    var city = localStorage.getItem('city');
    fetch(coordinateRoot + city + '&appid=' + apiKey)
        .then(function (response) {
            // console.log(response);
            return response.json();
        })
        .then(function(data) {
            localStorage.setItem('lat', data[0].lat);
            localStorage.setItem('lon', data[0].lon);
            getWeather();
        });
    };
    

function getWeather() {
    const lat = localStorage.getItem('lat');
    const lon = localStorage.getItem('lon');
    const weatherRoot = 'https://api.openweathermap.org/data/2.5/weather?lat=';
    fetch(weatherRoot + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=imperial')
        .then(function (response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            currentWeatherEl.innerHTML = "Here is today's forecast";
            currentCityEl.innerHTML = data.name;
            tempEl.innerHTML = ":" + data.main[3];
            windEl.innerHTML = ":" + data.wind[2];
            humidityEl.innerHTML = ":" + data.main[1];
            uvEl.innerHTML = ":" + data.timezone
        });
    };

$('#searchBtn').click( function () {
    var searchedCity = cityEl.value;
    localStorage.setItem('city', searchedCity);
    getCoordinates();
    });

