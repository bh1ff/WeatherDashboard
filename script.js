// Define the API key and an array to store cities
const apiKey = "0b26a0d735f1c68e879212c2650e5b40";
let cities = [];

// Function to fetch weather data for a given city
function getWeather(cityName) {
    // Construct the API URL for current weather
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;
    
    // Fetch data from the API for current weather
    fetch(queryURL)
        .then(response => response.json())
        .then(data => {
            // Display the current weather data
            displayWeather(data, cityName);
            
            // Fetch the 5-day forecast using the city's coordinates
            return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${apiKey}&units=imperial`);
        })
        .then(response => response.json())
        .then(data => {
            // Display the 5-day forecast
            displayForecast(data);
        });
}

// Function to display the current weather data
function displayWeather(data, cityName) {
    let todayEl = document.getElementById("today");
    todayEl.innerHTML = "";

    // Extract and format the required data
    let date = dayjs().format('M/D/YYYY');
    let iconURL = "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
    let temp = data.main.temp;
    let humidity = data.main.humidity;
    let windSpeed = data.wind.speed;

    // Create and append HTML elements to display the data
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

    // Save the city to local storage
    saveCity(cityName);
}

// New function to display the 5-day forecast
function displayForecast(data) {
    let forecastEl = document.getElementById("forecast");
    forecastEl.innerHTML = "";

    for (let i = 0; i < data.list.length; i += 8) {
        let dayData = data.list[i];
        let date = dayjs(dayData.dt_txt).format('M/D/YYYY');
        let iconURL = "https://openweathermap.org/img/w/" + dayData.weather[0].icon + ".png";
        let temp = dayData.main.temp;
        let humidity = dayData.main.humidity;

        let dayEl = document.createElement("div");
        dayEl.classList.add("col-md-2.4", "m-1", "bg-primary", "text-white", "rounded", "p-2");

        let dateEl = document.createElement("h4");
        dateEl.textContent = date;
        dayEl.appendChild(dateEl);

        let iconEl = document.createElement("img");
        iconEl.setAttribute("src", iconURL);
        iconEl.setAttribute("alt", dayData.weather[0].description);
        dayEl.appendChild(iconEl);

        let tempEl = document.createElement("p");
        tempEl.textContent = `Temp: ${temp}°F`;
        dayEl.appendChild(tempEl);

        let humidityEl = document.createElement("p");
        humidityEl.textContent = `Humidity: ${humidity}%`;
        dayEl.appendChild(humidityEl);

        forecastEl.appendChild(dayEl);
    }
}

// Function to save city to local storage
function saveCity(cityName) {
    if (cities.indexOf(cityName) === -1) {
        cities.push(cityName);
        localStorage.setItem("cities", JSON.stringify(cities));
    }
}

// Event listener for the search button
document.getElementById("search-button").addEventListener("click", function(event) {
    event.preventDefault();
    let city = document.getElementById("search-input").value.trim();
    
    // Check if the city is in the pre-existing list
    if (cities.includes(city)) {
        getWeather(city);
        document.getElementById("search-input").value = "";
    } else {
        alert("City not found in the list. Please select a city from the list.");
    }
});

// Event listener for the history list
document.getElementById("history").addEventListener("click", function(event) {
    let element = event.target;
    if (element.matches(".list-group-item")) {
        getWeather(element.textContent);
    }
});

// Initialization function
function init() {
    let storedCities = JSON.parse(localStorage.getItem("cities"));
    if (storedCities !== null) {
        cities = storedCities;
    }

    let lastCity = cities[cities.length - 1];
    if (lastCity) {
        getWeather(lastCity);
    } else {
        getWeather("London"); // Default city if none are stored
    }
}

// Call the initialization function
init();
