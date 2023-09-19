const apiKey = "0b26a0d735f1c68e879212c2650e5b40";
let cities = [];

function getWeather(cityName) {
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;
    fetch(queryURL)
        .then(response => response.json())
        .then(data => {
            displayWeather(data, cityName);
        });
}

function displayWeather(data, cityName) {
    let todayEl = document.getElementById("today");
    todayEl.innerHTML = "";

    // Extracting data from the API response
    let date = dayjs().format('M/D/YYYY');
    let iconURL = "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
    let temp = data.main.temp;
    let humidity = data.main.humidity;
    let windSpeed = data.wind.speed;

    // Creating and appending elements to display the extracted data
    let titleEl = document.createElement("h3");
    titleEl.innerHTML = `${cityName} (${date})<img src="${iconURL}" alt="${data.weather[0].description}">`;
    todayEl.appendChild(titleEl);

    let tempEl = document.createElement("p");
    tempEl.textContent = `Temperature: ${temp}°F`;
    todayEl.appendChild(tempEl);

    let humidityEl = document.createElement("p");
    humidityEl.textContent = `Humidity: ${humidity}%`;
    todayEl.appendChild(humidityEl);

    let windSpeedEl = document.createElement("p");
    windSpeedEl.textContent = `Wind Speed: ${windSpeed} MPH`;
    todayEl.appendChild(windSpeedEl);

    saveCity(cityName);
}

function saveCity(cityName) {
    if (cities.indexOf(cityName) === -1) {
        cities.push(cityName);
        localStorage.setItem("cities", JSON.stringify(cities));
    }
}

document.getElementById("search-button").addEventListener("click", function(event) {
    event.preventDefault();
    let city = document.getElementById("search-input").value.trim();
    if (city) {
        getWeather(city);
        document.getElementById("search-input").value = "";
    }
});

document.getElementById("history").addEventListener("click", function(event) {
    let element = event.target;
    if (element.matches(".list-group-item")) {
        getWeather(element.textContent);
    }
});

function init() {
    let storedCities = JSON.parse(localStorage.getItem("cities"));
    if (storedCities !== null) {
        cities = storedCities;
    }

    let lastCity = cities[cities.length - 1];
    if (lastCity) {
        getWeather(lastCity);
    } else {
        getWeather("London"); // Default city
    }
}

init();
