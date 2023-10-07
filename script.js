// Define the API key and an array to store cities
const apiKey = "Removed for security";
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

    let forecastTitle = document.createElement("h4");
    forecastTitle.textContent = "5 Day Forecast";
    forecastEl.appendChild(forecastTitle);

    for (let i = 0; i < data.list.length; i+=8) { // 5 days, data every 3 hours, so we pick one data point per day
        let dayData = data.list[i];

        let dayEl = document.createElement("div");
        dayEl.classList.add("col-12", "col-md-2", "forecast-day");

        let dateEl = document.createElement("p");
        dateEl.textContent = dayjs(dayData.dt_txt).format('M/D/YYYY');
        dayEl.appendChild(dateEl);

        let iconEl = document.createElement("img");
        iconEl.src = "https://openweathermap.org/img/w/" + dayData.weather[0].icon + ".png";
        iconEl.alt = dayData.weather[0].description;
        dayEl.appendChild(iconEl);

        let tempEl = document.createElement("p");
        tempEl.textContent = `Temp: ${dayData.main.temp}°F`;
        dayEl.appendChild(tempEl);

        let humidityEl = document.createElement("p");
        humidityEl.textContent = `Humidity: ${dayData.main.humidity}%`;
        dayEl.appendChild(humidityEl);

        forecastEl.appendChild(dayEl);
    }
}

// Function to save city to local storage
function saveCity(cityName) {
    cities = [cityName]; // Always set cities to only the current city
    localStorage.setItem("cities", JSON.stringify(cities));

    // Log for debugging
    console.log(`Saved ${cityName} to localStorage. Current cities:`, cities);

    // Add the city to the datalist
    let cityList = document.getElementById("city-list");
    cityList.innerHTML = ""; // Clear previous options
    let option = document.createElement("option");
    option.value = cityName;
    cityList.appendChild(option);
}

// Event listener for the search button
document.getElementById("search-button").addEventListener("click", function(event) {
    event.preventDefault();
    let city = document.getElementById("search-input").value.trim();
    getWeather(city);
    document.getElementById("search-input").value = "";
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

    // Log for debugging
    console.log(`Retrieved cities from localStorage:`, cities);

    // Populate the datalist with cities from local storage
    let cityList = document.getElementById("city-list");
    cities.forEach(city => {
        let option = document.createElement("option");
        option.value = city;
        cityList.appendChild(option);
    });

    let lastCity = cities[cities.length - 1];
    if (lastCity) {
        getWeather(lastCity);
    } else {
        getWeather("London"); // Default city if none are stored
    }
}

// Call the initialization function
init();
