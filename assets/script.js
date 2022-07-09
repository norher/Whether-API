const cityEl = document.getElementById('cityInput');
const currentCityEl = document.getElementById('cityName');
const tempEl = document.getElementById('temp');
const windEl = document.getElementById('wind');
const humidityEl = document.getElementById('humidity');
const uvEl = document.getElementById('uv');
const cardHolderEl = document.getElementById('cardHolder');


const apiKey = 'ebfa1cc409bdad3120631b857ca0e364';


        
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
    const weatherRoot = 'https://api.openweathermap.org/data/3.0/onecall?lat=';
    fetch(weatherRoot + lat + '&lon=' + lon + '&units=imperial&exclude=hourly,minutely&appid=' + apiKey)
        .then(function (response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            currentCityEl.innerText = "Here is today's forecast for: " + localStorage.getItem('city').toUpperCase();
            tempEl.innerText = `Currently it's ${data.current.temp} °F outside`;
            windEl.innerText = `Wind is ${data.current.wind_speed} MPH`;
            humidityEl.innerText = `Humidity is ${data.current.humidity}%`;
            uvEl.innerText = `UV Index is: ${data.current.uvi}`;
            for (var i = 1; i < 6; i++) {
                var card = document.createElement('div');
                // card.addClass("CardHolder")
                var date = moment().add(i, 'd').format('dddd, MMM Do');
                var cardTitle = document.createElement('h5');
                cardTitle.textContent = date;
                var contents = document.createElement('ul');
                var templi = document.createElement('li');
                templi.textContent = `Temp: ${data.daily[i].temp.day} °F`;
                var windli = document.createElement('li');
                windli.textContent = `Wind: ${data.daily[i].wind_speed} MPH`;
                var humidityli = document.createElement('li');
                humidityli.textContent = `Humidity: ${data.daily[i].humidity}%`;
                contents.appendChild(templi);
                contents.appendChild(windli);
                contents.appendChild(humidityli);
                card.appendChild(cardTitle);
                card.appendChild(contents);
                cardHolderEl.appendChild(card);
            };
        });
    };

$('#searchBtn').click( function () {
    var searchedCity = cityEl.value;
    localStorage.setItem('city', searchedCity);
    getCoordinates();
    cityEl.textContent = '';
    });

